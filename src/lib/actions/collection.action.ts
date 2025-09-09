"use server";

import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
} from "../../../types/global";
import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  CollectionBaseSchema,
  PaginatedSearchParamsSchema,
} from "../validations";
import { CollectionBaseParams } from "../../../types/action";
import { Collection, Question } from "../../../database";
import { NotFoundError } from "../http-errors";
import { revalidatePath } from "next/cache";
import ROUTES from "../../../constants/route";
import mongoose, { PipelineStage } from "mongoose";

export const toggleSaveCollection = async (
  params: CollectionBaseParams
): Promise<ActionResponse<{ saved: boolean }>> => {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult.session!.user!.id;

  try {
    const question = await Question.findById(questionId);

    if (!question) throw new NotFoundError("Question");

    const collection = await Collection.findOne({
      author: userId,
      question: questionId,
    });

    if (collection) {
      await Collection.findByIdAndDelete(collection._id);

      revalidatePath(ROUTES.QUESTION(questionId));

      return { success: true, data: { saved: false }, status: 200 };
    }

    await Collection.create({ author: userId, question: questionId });

    revalidatePath(ROUTES.QUESTION(questionId));

    return { success: true, data: { saved: true }, status: 200 };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const hasSavedQuestion = async (
  params: CollectionBaseParams
): Promise<ActionResponse<{ saved: boolean }>> => {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult.session!.user!.id;

  try {
    const collection = await Collection.findOne({
      author: userId,
      question: questionId,
    });

    return { success: true, data: { saved: !!collection }, status: 200 };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getSavedQuestions = async (
  params: PaginatedSearchParams
): Promise<ActionResponse<{ collection: Collection[]; isNext: boolean }>> => {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const userId = validationResult.session!.user!.id;
  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;

  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  const sortOptions: Record<string, Record<string, 1 | -1>> = {
    mostRecent: { "question.createdAt": -1 },
    oldest: { "question.createdAt": 1 },
    mostViewed: { "question.views": -1 },
    mostVoted: { "question.upVotes": -1 },
    mostAnswered: { "question.answers": -1 },
  };

  const sortCriteria = sortOptions[filter as keyof typeof sortOptions] || {
    "question.createdAt": -1,
  };

  try {
    const pipeline: PipelineStage[] = [
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      { $unwind: "$question" },
      {
        $lookup: {
          from: "users",
          localField: "question.author",
          foreignField: "_id",
          as: "question.author",
        },
      },
      { $unwind: "$question.author" },
      {
        $lookup: {
          from: "tags",
          localField: "question.tags",
          foreignField: "_id",
          as: "question.tags",
        },
      },
    ];

    if (query) {
      pipeline.push({
        $match: {
          $or: [
            { "question.title": { $regex: query, $options: "i" } },
            { "question.content": { $regex: query, $options: "i" } },
          ],
        },
      });
    }

    const [totalCount] = await Collection.aggregate([
      ...pipeline,
      { $count: "count" },
    ]);

    pipeline.push({ $sort: sortCriteria }, { $skip: skip }, { $limit: limit });
    pipeline.push({ $project: { author: 1, question: 1 } });

    const questions = await Collection.aggregate(pipeline);

    const isNext = totalCount?.count > skip + questions.length;

    return {
      success: true,
      data: { collection: JSON.parse(JSON.stringify(questions)), isNext },
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
