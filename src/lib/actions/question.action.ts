"use server";

import { revalidatePath } from "next/cache";
import { Answer, Collection, Interaction, Vote } from "../../../database";
import Question, { IQuestionDoc } from "../../../database/question.model";
import TagQuestion from "../../../database/tag-question.model"; // ITagQuestion,
import Tag, { ITagDoc } from "../../../database/tag.model";
import {
  CreateQuestionsParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionParams,
  IncrementViewsParams,
  RecommendationParams,
} from "../../../types/action";
import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
} from "../../../types/global";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import dbConnect from "../mongoose";
import {
  AskQuestionSchema,
  DeleteQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
  IncrementViewsSchema,
  PaginatedSearchParamsSchema,
} from "../validations";
import mongoose, { FilterQuery, Types } from "mongoose";
import { after } from "next/server";
import { createInteraction } from "./interactions.action";
import { auth } from "../../../auth";

export async function createQuestion(
  params: CreateQuestionsParams
): Promise<ActionResponse<Question>> {
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { title, content, tags } = validationResult.params!;
  const userId = validationResult!.session!.user!.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [question] = await Question.create(
      [{ title, content, author: userId }],
      { session }
    );

    if (!question) {
      throw new Error(" Failed to create question");
    }

    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { new: true, upsert: true, session }
      );

      tagIds.push(existingTag._id);
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    }

    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    await Question.findByIdAndUpdate(
      question._id,
      { $push: { tags: { $each: tagIds } } },
      { session }
    );

    after(async () => {
      await createInteraction({
        action: "post",
        actionId: question._id.toString(),
        actionTarget: "question",
        authorId: userId as string,
      });
    });

    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
      status: 201,
    };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function editQuestion(
  params: EditQuestionParams
): Promise<ActionResponse<IQuestionDoc>> {
  const validationResult = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { title, content, tags, questionId } = validationResult.params!;
  const userId = validationResult!.session!.user!.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId).populate("tags");

    if (!question) {
      throw new NotFoundError("Question");
    }

    if (question.author.toString() !== userId) {
      throw new UnauthorizedError(
        "You are not authorized to edit this question"
      );
    }

    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
      await question.save({ session });
    }

    const tagsToAdd = tags.filter(
      (tag) =>
        !question.tags.some((t: ITagDoc) =>
          t.name.toLowerCase().includes(tag.toLowerCase())
        )
    );

    const tagsToRemove = question.tags.filter(
      (tag: ITagDoc) =>
        !tags.some((t) => t.toLowerCase() === tag.name.toLowerCase())
    );

    const newTagDocuments = [];

    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: `^${tag}$`, $options: "i" } },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { new: true, upsert: true, session }
        );

        if (existingTag) {
          newTagDocuments.push({
            tag: existingTag._id,
            question: questionId,
          });
          question.tags.push(existingTag._id);
        }
      }
    }

    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map((tag: ITagDoc) => tag._id);

      await Tag.updateMany(
        {
          _id: { $in: tagIdsToRemove },
        },
        {
          $inc: { questions: -1 },
        },
        { session }
      );
      await TagQuestion.deleteMany(
        {
          tag: { $in: tagIdsToRemove },
          question: questionId,
        },
        { session }
      );
      await Tag.deleteMany(
        {
          _id: { $in: tagIdsToRemove },
          question: 0,
        },
        { session }
      );

      question.tags = question.tags.filter(
        (tag: mongoose.Types.ObjectId) =>
          !tagIdsToRemove.some((id: mongoose.Types.ObjectId) =>
            id.equals(tag._id)
          )
      );
    }

    if (newTagDocuments.length > 0) {
      await TagQuestion.insertMany(newTagDocuments, { session });
    }

    await question.save({ session });

    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
      status: 200,
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getQuestion(
  params: GetQuestionParams
): Promise<ActionResponse<Question>> {
  const validationResult = await action({
    params,
    schema: GetQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findById(questionId)
      .populate("tags")
      .populate("author", "_id name image");

    if (!question) {
      throw new NotFoundError("Question");
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export const getRecommendedQuestions = async ({
  userId,
  query,
  skip,
  limit,
}: RecommendationParams) => {
  const interactions = await Interaction.find({
    user: new Types.ObjectId(userId),
    actionType: "Question",
    action: { $in: ["view", "upvote", "post", "bookmark"] },
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const interactedQuestionIds = interactions.map(
    (interaction) => interaction.actionId
  );

  const interactedQuestions = await Question.find({
    _id: { $in: interactedQuestionIds },
  }).select("tags");

  const allTags = interactedQuestions.flatMap((question) =>
    question.tags.map((tag: Types.ObjectId) => tag.toString())
  );

  const uniqueTagIds = [...new Set(allTags)];

  const recommendedQuery: FilterQuery<typeof Question> = {
    _id: { $nin: interactedQuestionIds },
    author: { $ne: new Types.ObjectId(userId) },
    tags: {
      $in: uniqueTagIds.map((tagId: string) => new Types.ObjectId(tagId)),
    },
  };

  if (query) {
    recommendedQuery.$or = [
      { title: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
    ];
  }

  const total = await Question.countDocuments(recommendedQuery);

  const questions = await Question.find(recommendedQuery)
    .populate("tags", "name")
    .populate("author", "name image")
    .sort({ upvote: -1, views: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const isNext = total > skip + questions.length;

  return {
    questions: JSON.parse(JSON.stringify(questions)),
    isNext,
  };
};

export async function getQuestions(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ questions: Question[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;

  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  const filterQuery: FilterQuery<typeof Question> = {};

  if (filter === "recommended") {
    const session = await auth();
    const userId = session!.user!.id;

    if (!userId) {
      return {
        success: true,
        data: { questions: [], isNext: false },
        status: 200,
      };
    }

    const recommendedQuestions = await getRecommendedQuestions({
      userId,
      query,
      skip,
      limit,
    });

    return {
      success: true,
      data: recommendedQuestions,
      status: 200,
    };
  }

  if (query) {
    filterQuery.$or = [
      { title: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "unanswered":
      filterQuery.answers = 0;
      sortCriteria = { createdAt: -1 };
      break;
    case "popular":
      sortCriteria = { upVotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalQuestions = await Question.countDocuments(filterQuery);
    const questions = await Question.find(filterQuery)
      .populate("tags", "name")
      .populate("author", "name image")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function incrementViews(
  params: IncrementViewsParams
): Promise<ActionResponse<{ views: number }>> {
  const validationResult = await action({
    params,
    schema: IncrementViewsSchema,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      throw new NotFoundError("Question");
    }

    question.views += 1;
    await question.save();

    return {
      success: true,
      data: { views: question.views },
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export const getHotQuestions = async (): Promise<
  ActionResponse<Question[]>
> => {
  try {
    await dbConnect();

    const questions = await Question.find()
      .sort({ upVotes: -1, views: -1 })
      .limit(5);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(questions)),
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const deleteUserQuestion = async (
  params: DeleteQuestionParams
): Promise<ActionResponse<Question>> => {
  const validationResult = await action({
    params,
    schema: DeleteQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { questionId } = validationResult.params!;
  const userId = validationResult!.session!.user!.id;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const question = await Question.findById(questionId).session(session);

    if (!question) {
      throw new NotFoundError("Question");
    }

    if (question.author._id.toString() !== userId) {
      throw new UnauthorizedError(
        "You are not authorized to delete this question"
      );
    }

    await Collection.deleteMany({ question: questionId }, { session });

    await TagQuestion.deleteMany({ question: questionId }, { session });

    if (question.tags.length > 0) {
      await Tag.updateMany(
        { _id: { $in: question.tags } },
        { $inc: { questions: -1 } },
        { session }
      );
    }

    await Vote.deleteMany(
      { actionId: questionId, actionType: "question" },
      { session }
    );

    const answers = await Answer.find({ question: questionId }).session(
      session
    );

    if (answers.length > 0) {
      await Answer.deleteMany({ question: questionId }, { session });
      const answerIds = answers.map((answer) => answer._id);
      await Vote.deleteMany(
        { actionId: { $in: answerIds }, actionType: "answer" },
        { session }
      );
    }

    await Question.findByIdAndDelete(questionId, { session });

    await session.commitTransaction();

    revalidatePath(`/profle/${userId}`);

    return {
      success: true,

      status: 200,
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
};
