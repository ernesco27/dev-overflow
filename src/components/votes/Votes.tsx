"use client";

import handleError from "@/lib/handlers/error";
import { cn, formatNumber } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { ErrorResponse } from "../../../types/global";

interface Props {
  upvotes: number;
  downvotes: number;
  hasupVoted: boolean;
  hasdownVoted: boolean;
}

const Votes = ({ upvotes, downvotes, hasupVoted, hasdownVoted }: Props) => {
  const [isloading, setIsLoading] = useState(false);
  const session = useSession();
  const userId = session.data?.user?.id;

  const handleVote = async (VoteType: "upvote" | "downvote") => {
    if (!userId) return toast.error("Please login to vote");
    setIsLoading(true);
    try {
      const successMessage =
        VoteType === "upvote"
          ? `Upvote ${!hasupVoted ? "added" : "removed"} successfully`
          : `Downvote ${!hasdownVoted ? "added" : "removed"} successfully`;

      toast.success(successMessage);
    } catch (error) {
      toast.error("An error occurred while voting. Please try again");
      handleError(error, "server") as ErrorResponse;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={hasupVoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
          alt="upvote"
          width={18}
          height={18}
          className={cn("cursor-pointer", isloading && "opacity-50")}
          aria-label="upvote"
          onClick={() => !isloading && handleVote("upvote")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(upvotes)}
          </p>
        </div>
      </div>
      <div className="flex-center gap-1.5">
        <Image
          src={hasdownVoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"}
          alt="downvote"
          width={18}
          height={18}
          className={cn("cursor-pointer", isloading && "opacity-50")}
          aria-label="downvote"
          onClick={() => !isloading && handleVote("downvote")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
