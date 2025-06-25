import Link from "next/link";
import React from "react";
import ROUTES from "../../../constants/route";
import Image from "next/image";
import TagCard from "../cards/TagCard";

const topQuestions = [
  {
    _id: "1",
    question: "What is the best way to learn React?",
  },
  {
    _id: "2",
    question: "How do I manage state in a React application?",
  },
  {
    _id: "3",
    question: "What are the differences between React and Angular?",
  },
  {
    _id: "4",
    question: "How do I optimize performance in a React app?",
  },
  {
    _id: "5",
    question: "What are React hooks and how do I use them?",
  },
];

const popularTags = [
  {
    _id: "1",
    name: "react",
    questions: 120,
  },
  {
    _id: "2",
    name: "javaScript",
    questions: 95,
  },
  { _id: "3", name: "css", questions: 80 },
  {
    _id: "4",
    name: "html",
    questions: 70,
  },
  {
    _id: "5",
    name: "node.js",
    questions: 60,
  },
];

const RightSidebar = () => {
  return (
    <section className="pt-36 custom-scrollbar background-light900_dark200 sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 shadow-light-300 dark:shadow-none max-xl:hidden  ">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px] ">
          {topQuestions.map(({ _id, question }) => (
            <Link
              key={_id}
              href={ROUTES.PROFILE(_id)}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">{question}</p>
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
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900 ">Popular Tags</h3>
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
      </div>
    </section>
  );
};

export default RightSidebar;
