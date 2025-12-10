"use client";

import Image from "next/image";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { ArrowUpRight, Clock, DollarSign } from "lucide-react";

interface Props {
  job: {
    id: number;
    companyLogo: string;
    position: string;
    location: string;
    salary: number;
    duration: string;
    description: string;
  };
  showActionBtns?: boolean;
}

const JobCard = ({ job, showActionBtns = false }: Props) => {
  return (
    <div className="flex gap-6 card-wrapper rounded-[10px]  p-4">
      <div className="size-24 rounded-md bg-amber-300 overflow-hidden">
        {/* <Image fill src={job.companyLogo} alt="company logo" /> */}
      </div>
      <div className="flex flex-col flex-1 gap-2">
        <div className="flex-between">
          <p className="text-dark200_light800 paragraph-semibold line-clamp-1">
            {job.position}
          </p>
          <Badge className="subtle-medium background-light800_dark400! text-dark200_light800 rounded-xl  px-4 py-2 capitalize flex flex-row gap-2">
            {job.location}
          </Badge>
        </div>
        <div className="text-sm text-dark300_light700">{job.description}</div>
        <div className="flex-between mt-6">
          <div className="flex-center gap-4 text-sm text-dark400_light500">
            <p className="flex-center gap-2">
              <Clock className="size-4" /> {job.duration}
            </p>
            <p className="flex-center gap-2">
              <DollarSign className="size-4" /> {job.salary || "Undisclosed"}
            </p>
          </div>
          {showActionBtns && (
            <Link
              href=""
              className="text-sm primary-text-gradient flex-center gap-2 font-semibold"
            >
              View Job <ArrowUpRight className="size-4 text-primary-500" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
