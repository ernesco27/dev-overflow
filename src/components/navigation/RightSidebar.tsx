import Link from "next/link";
import React from "react";
import ROUTES from "../../../constants/route";
import Image from "next/image";
import TagCard from "../cards/TagCard";
import { getHotQuestions } from "@/lib/actions/question.action";
import DataRenderer from "../DataRenderer";
import { getTopTags } from "@/lib/actions/tag.action";
import { cacheLife } from "next/cache";

const RightSidebar = async () => {
  "use cache";
  cacheLife("max");

  const [questionsResponse, tagsResponse] = await Promise.all([
    getHotQuestions(),
    getTopTags(),
  ]);

  const {
    success: questionsSuccess,
    data: hotQuestions,
    error: questionsError,
  } = questionsResponse;

  const {
    success: tagsSuccess,
    data: popularTags,
    error: tagsError,
  } = tagsResponse;

  return (
    <section className="pt-36 custom-scrollbar background-light900_dark200 sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 shadow-light-300 dark:shadow-none max-xl:hidden  ">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <DataRenderer
          data={hotQuestions}
          success={questionsSuccess}
          error={questionsError}
          empty={{
            title: "No Questions Found",
            message: "No questions have been asked yet.",
          }}
          render={(hotQuestions) => (
            <div className="mt-7 flex w-full flex-col gap-[30px] ">
              {hotQuestions?.map(({ _id, title }) => (
                <Link
                  key={_id}
                  href={ROUTES.QUESTION(_id)}
                  className="flex cursor-pointer items-center justify-between gap-7"
                >
                  <p className="body-medium text-dark500_light700 line-clamp-2">
                    {title}
                  </p>
                  <Image
                    src="/icons/chevron-right.svg"
                    alt="chevron"
                    width={20}
                    height={20}
                    className="invert-colors"
                  />
                </Link>
              ))}
            </div>
          )}
        />
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900 ">Popular Tags</h3>
        <DataRenderer
          success={tagsSuccess}
          error={tagsError}
          data={popularTags}
          empty={{
            title: "No Tags Found",
            message: "No tags have been created yet.",
          }}
          render={(popularTags) => (
            <div className="mt-7 flex flex-col gap-4">
              {popularTags.map(({ _id, name, questions }) => (
                <TagCard
                  key={_id}
                  _id={_id}
                  name={name}
                  questions={questions}
                  compact
                  showCount
                />
              ))}
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default RightSidebar;
