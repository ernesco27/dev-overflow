import React from "react";
import { Answer } from "../../../types/global";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import ROUTES from "../../../constants/route";
import { getTimeStamp } from "@/lib/utils";
import Preview from "../editor/Preview";

const AnswerCard = ({ _id, author, content, createdAt }: Answer) => {
  return (
    <article className="light-border border-b py-10">
      <span id={JSON.stringify(_id)} className="hash-span" />
      <div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2 ">
        <div className="flex flex-1 items-start gap-1 sm:items-center">
          <UserAvatar
            id={author._id}
            imageUrl={author.image}
            name={author.name}
            className="size-5 rounded-full object-cover max-sm:mt-2 "
          />
          <Link
            href={ROUTES.PROFILE(author._id)}
            className="flex flex-col sm:flex-row sm:items-center max-sm:ml-1"
          >
            <p className="body-semibold text-dark300_light700">
              {author.name ?? "Unanimous"}
            </p>
            <p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1 ">
              <span className="max-sm:hidden"> • </span>
              answered {getTimeStamp(createdAt)}
            </p>
          </Link>
        </div>
        <div className="flex justify-end">Votes</div>
      </div>
      <Preview content={content} />
    </article>
  );
};

export default AnswerCard;
