"use server";

import { Answer, Question, Vote } from "../../../database";
import { CreateVoteParams, UpdateVoteParams } from "../../../types/action";
import { ActionResponse, ErrorResponse } from "../../../types/global";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import { createVoteSchema, updateVoteSchema } from "../validations";
import mongoose, { ClientSession } from "mongoose";

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
  const voteField = voteType === "upvote" ? "upvotes" : "downvotes";

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
        await Vote.findOneAndUpdate(
          { _id: existingVote._id },
          { voteType },
          { session }
        );
        await updateVoteCount(
          { targetId, targetType, voteType, change: 1 },
          session
        );
      }
    } else {
      await Vote.create([{ targetId, targetType, voteType, change: 1 }], {
        session,
      });
      await updateVoteCount(
        { targetId, targetType, voteType, change: 1 },
        session
      );
    }

    await session.commitTransaction();
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
};
