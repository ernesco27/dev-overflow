import React from "react";
import { RouteParams, Tags } from "../../../../../types/global";
import UserAvatar from "@/components/UserAvatar";
import Link from "next/link";
import ROUTES from "../../../../../constants/route";
import Metric from "@/components/Metric";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/editor/Preview";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { redirect } from "next/navigation";
import { after } from "next/server";
import AnswerForm from "@/components/forms/AnswerForm";
import { GetAnswers } from "@/lib/actions/answer.action";
import AllAswers from "@/components/answers/AllAswers";

const QuestionDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const [questionResponse, answersResponse] = await Promise.all([
    getQuestion({ questionId: id }),
    GetAnswers({
      questionId: id,
      page: 1,
      pageSize: 10,
      filter: "latest",
    }),
  ]);

  // Destructure responses
  const {
    success: questionSuccess,
    data: question,
    error: questionError,
  } = questionResponse;
  const {
    success: areAnswersLoaded,
    data: answersResult,
    error: answersError,
  } = answersResponse;

  // const { success, data: question } = await getQuestion({
  //   questionId: id,
  // });

  // const {
  //   success: areAnswersLoaded,
  //   data: answersResult,
  //   error: answersError,
  // } = await GetAnswers({
  //   questionId: id,
  //   page: 1,
  //   pageSize: 10,
  //   filter: "latest",
  // });

  after(async () => {
    await incrementViews({ questionId: id });
  });

  if (!questionSuccess || !question) return redirect("/404");

  console.log("Answers Result:", answersResult);

  const {
    _id,
    author,
    createdAt,
    answers,
    views,
    tags,
    // upvotes,
    // downvotes,
    content,
    title,
  } = question;

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={author._id}
              name={author.name}
              imageUrl={author.image}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">
                {author.name}
              </p>
            </Link>
          </div>
          <div className="flex justify-end">
            <p>Votes</p>
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(new Date(createdAt))}`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="clock icon"
          value={answers}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="clock icon"
          value={formatNumber(views)}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
      </div>
      <Preview content={content} />
      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag: Tags) => (
          <TagCard
            key={tag._id as string}
            _id={tag._id}
            name={tag.name}
            compact
          />
        ))}
      </div>
      <section className="my-5">
        <AllAswers
          data={answersResult?.answers}
          success={areAnswersLoaded}
          error={answersError}
          totalAnswers={answersResult?.totalAnswers || 0}
        />
      </section>
      <section className="my-5">
        <AnswerForm
          questionId={_id}
          questionTitle={title}
          questionContent={content}
        />
      </section>
    </>
  );
};

export default QuestionDetails;
