import React from "react";
import { RouteParams } from "../../../../../types/global";
import { getTagQuestions } from "@/lib/actions/tag.action";

import ROUTES from "../../../../../constants/route";
import LocalSearch from "@/components/search/LocalSearch";

import DataRenderer from "@/components/DataRenderer";
import { EMPTY_QUESTION } from "../../../../../constants/states";
import QuestionCard from "@/components/cards/QuestionCard";

const TagDetails = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize, query } = await searchParams;

  const { success, data, error } = await getTagQuestions({
    tagId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
  });

  const { tag, questions } = data || {};

  return (
    <>
      <section className="w-full flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center ">
        <h1 className="h1-bold text-dark100_light900">{tag?.name}</h1>
      </section>
      <section className="mt-11">
        <LocalSearch
          route={ROUTES.TAG(id)}
          placeholder="Search questions here..."
          otherClasses="flex-1"
          imgSrc="/icons/search.svg"
        />
      </section>

      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default TagDetails;
