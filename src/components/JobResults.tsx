import { getJobs } from "@/lib/actions/jobs.action";
import JobCard from "./cards/JobCard";
import DataRenderer from "./DataRenderer";
import { EMPTY_QUESTION } from "../../constants/states";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const JobResults = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, country } = await searchParams;

  const {
    data: availableJobs,
    error: jobsError,
    success: jobsSuccess,
  } = await getJobs({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    country: country || "",
  });

  const jobs = availableJobs?.jobs || [];

  return (
    <DataRenderer
      success={jobsSuccess}
      error={jobsError}
      data={jobs}
      empty={EMPTY_QUESTION}
      render={(jobs) => (
        <div className="mt-10 flex w-full flex-col gap-6">
          {jobs.map((job: any) => (
            <JobCard key={job.job_id} job={job} showActionBtns />
          ))}
        </div>
      )}
    />
  );
};

export default JobResults;
