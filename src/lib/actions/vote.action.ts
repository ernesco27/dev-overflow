"use server";

import { revalidatePath } from "next/cache";
import { Answer, Question, Vote } from "../../../database";
import {
  CreateVoteParams,
  HasVotedParams,
  HasVotedResponse,
  UpdateVoteParams,
} from "../../../types/action";
import { ActionResponse, ErrorResponse } from "../../../types/global";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import {
  createVoteSchema,
  hasVotedSchema,
  updateVoteSchema,
} from "../validations";
import mongoose, { ClientSession } from "mongoose";
import ROUTES from "../../../constants/route";

export const updateVoteCount = async (
  params: UpdateVoteParams,
  session?: ClientSession
): Promise<ActionResponse> => {
  const validationResult = await action({
    params,
    schema: updateVoteSchema,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { targetId, targetType, voteType, change } = validationResult.params!;

  const Model = targetType === "question" ? Question : Answer;
  const voteField = voteType === "upvote" ? "upVotes" : "downVotes";

  try {
    const result = await Model.findByIdAndUpdate(
      targetId,
      { $inc: { [voteField]: change } },
      { new: true, session }
    );

    if (!result) {
      return handleError(
        new Error("Failed to update vote count")
      ) as ErrorResponse;
    }
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const createVote = async (
  params: CreateVoteParams
): Promise<ActionResponse> => {
  const validationResult = await action({
    params,
    schema: createVoteSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { targetId, targetType, voteType } = validationResult.params!;
  const userId = validationResult.session!.user!.id;

  if (!userId) {
    return handleError(
      new UnauthorizedError("You must be logged in to vote")
    ) as ErrorResponse;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingVote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    }).session(session);

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await Vote.deleteOne({ _id: existingVote._id }).session(session);
        await updateVoteCount(
          { targetId, targetType, voteType, change: -1 },
          session
        );
      } else {
        await Vote.findByIdAndUpdate(
          existingVote._id,
          { voteType },
          { new: true, session }
        );
        await updateVoteCount(
          { targetId, targetType, voteType: existingVote.voteType, change: -1 },
          session
        );
        await updateVoteCount(
          { targetId, targetType, voteType, change: 1 },
          session
        );
      }
    } else {
      await Vote.create(
        [
          {
            author: userId,
            actionId: targetId,
            actionType: targetType,
            voteType,
            change: 1,
          },
        ],
        {
          session,
        }
      );
      await updateVoteCount(
        { targetId, targetType, voteType, change: 1 },
        session
      );
    }

    await session.commitTransaction();
    revalidatePath(ROUTES.QUESTION(targetId));
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
};

export const hasVoted = async (
  params: HasVotedParams
): Promise<ActionResponse<HasVotedResponse>> => {
  const validationResult = await action({
    params,
    schema: hasVotedSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { targetId, targetType } = validationResult.params!;
  const userId = validationResult.session!.user!.id;

  try {
    const vote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    });

    if (!vote) {
      return {
        success: false,
        data: { hasUpVoted: false, hasDownVoted: false },
      };
    }

    return {
      success: true,
      data: {
        hasUpVoted: vote.voteType === "upvote",
        hasDownVoted: vote.voteType === "downvote",
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
