"use client";

import { getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import ROUTES from "../../../constants/route";
import TagCard from "./TagCard";
import Metric from "../Metric";

interface Props {
  question: Question;
}

const QuestionCard = ({
  question: { _id, title, tags, author, upVotes, answers, views, createdAt },
}: Props) => {
  console.log(author);
  console.log("author name", author?.[0].name);

  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hiddden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={ROUTES.QUESTION(_id)}>
            <h3 className="sm:h3-semi-bold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
      </div>
      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {tags.map(({ _id, name }: Tags) => (
          <TagCard key={_id} _id={_id} name={name} compact />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author?.[0].image}
          alt={author?.[0].name}
          value={author?.[0].name}
          title={`• asked ${getTimeStamp(createdAt)}`}
          href={ROUTES.PROFILE(author?.[0]._id)}
          textStyles="body-medium text-dark400_light700"
          isAuthor
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start ">
          <Metric
            imgUrl="/icons/like.svg"
            alt="like"
            value={upVotes}
            title="Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/message.svg"
            alt="answers"
            value={answers}
            title="Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/eye.svg"
            alt="views"
            value={views}
            title="Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
