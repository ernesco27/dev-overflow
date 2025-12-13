"use client";

import Image from "next/image";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { ArrowUpRight, Clock, DollarSign } from "lucide-react";
import { JobPosting } from "../../../types/global";

interface Props {
  job: JobPosting;
  showActionBtns?: boolean;
}

const JobCard = ({ job, showActionBtns = false }: Props) => {
  // console.log("job", job);

  return (
    <div className="flex gap-6 card-wrapper rounded-[10px]  p-4">
      <div className="size-24 rounded-md bg-amber-300 overflow-hidden">
        <Image
          src={job.employer_logo || "/icons/avatar.svg"}
          alt="company logo"
          width={96}
          height={96}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col flex-1 gap-2">
        <div className="flex-between">
          <p className="text-dark200_light800 paragraph-semibold line-clamp-1">
            {job.job_title}
          </p>
          <Badge className="subtle-medium background-light800_dark400! text-dark200_light800 rounded-xl  px-4 py-2 capitalize flex flex-row gap-2">
            {job.job_location}
          </Badge>
        </div>
        <div className="text-sm text-dark300_light700 line-clamp-3">
          {job.job_description}
        </div>
        <div className="flex-between mt-6">
          <div className="flex-center gap-4 text-sm text-dark400_light500">
            <p className="flex-center gap-2">
              <Clock className="size-4" /> {job.job_employment_type}
            </p>
            <p className="flex-center gap-2">
              <DollarSign className="size-4" />{" "}
              {job.job_salary || "Undisclosed"}
            </p>
          </div>
          {showActionBtns && (
            <Link
              href={job.job_apply_link}
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
