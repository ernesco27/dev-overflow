"use server";

import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
} from "../../../types/global";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { GetUserSchema, PaginatedSearchParamsSchema } from "../validations";
import { FilterQuery } from "mongoose";
import { Answer, Question, User } from "../../../database";
import { GetUserParams } from "../../../types/action";
import { NotFoundError } from "../http-errors";

export const getUsers = async (
  params: PaginatedSearchParams
): Promise<ActionResponse<{ users: User[]; isNext: boolean }>> => {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;

  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  const filterQuery: FilterQuery<typeof User> = {};

  if (query) {
    filterQuery.$or = [
      { email: { $regex: query, $options: "i" } },
      { name: { $regex: query, $options: "i" } },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { reputation: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalUsers = await User.countDocuments(filterQuery);

    const users = await User.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalUsers > skip + users.length;

    return {
      success: true,
      data: {
        users: JSON.parse(JSON.stringify(users)),
        isNext,
      },
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getUser = async (
  params: GetUserParams
): Promise<
  ActionResponse<{
    user: User;
    totalQuestions: number;
    totalAnswers: number;
  }>
> => {
  const validationResult = await action({
    params,
    schema: GetUserSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = validationResult.params!;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User");
    }

    const totalQuestions = await Question.countDocuments({ author: userId });
    const totalAnswers = await Answer.countDocuments({ author: userId });

    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)),
        totalQuestions,
        totalAnswers,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
