import CommonFilter from "@/components/filters/CommonFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { HomePageFilters } from "../../../../constants/filters";
import DataRenderer from "@/components/DataRenderer";

import { EMPTY_QUESTION } from "../../../../constants/states";

import JobCard from "@/components/cards/JobCard";
import { api } from "@/lib/api";
import { getCountries } from "@/lib/actions/countries.action";

const availableJobs = [
  {
    id: 1,
    companyLogo: "/images/logo.png",
    position: "Data Entry Officer",
    location: "Tema, Ghana",
    duration: "Full-Time",
    salary: 1000,
    description:
      "We are looking for a detail-oriented Data Entry Officer to join our team. Responsibilities include accurate data input, maintaining databases, and ensuring data integrity. Proficiency in Microsoft Office Suite is required.",
  },
  {
    id: 2,
    companyLogo: "/images/logo.png",
    position: "Accounts Officer",
    location: "Accra, Ghana",
    duration: "Full-Time",
    salary: 2000,
    description:
      "An Accounts Officer is needed to manage financial records, process invoices, and assist with budget preparation. Candidates should have a degree in Accounting or a related field and experience with accounting software.",
  },
  {
    id: 3,
    companyLogo: "/images/logo.png",
    position: "Agric Extension Officer",
    location: "Tamale, Ghana",
    duration: "Contract (6 months)",
    salary: 2500,
    description:
      "Seeking an Agric Extension Officer to provide guidance and support to local farmers. Duties include conducting field visits, organizing training sessions, and disseminating agricultural best practices. A background in agriculture is essential.",
  },
];

const FindJobs = async () => {
  const { data: rawData } = await getCountries();

  const countries = rawData!.countries
    .map((country) => ({
      name: country.name.common,
      value: country.name.common,
      svg: country.flags.svg,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  let error;
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>
      <div className="mt-9">
        <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <LocalSearch
            route="/"
            placeholder="Job Title, Company, or Keywords"
            otherClasses="flex-1"
            imgSrc="/icons/search.svg"
          />
          <CommonFilter
            filters={countries}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
            containerClasses=" max-md:flex"
            imgSrc="/icons/search.svg"
            placeholder="Select Location"
          />
        </section>
        <DataRenderer
          success={true}
          error={error}
          data={availableJobs}
          empty={EMPTY_QUESTION}
          render={(availableJobs) => (
            <div className="mt-10 flex w-full flex-col gap-6">
              {availableJobs.map((job) => (
                <JobCard key={job.id} job={job} showActionBtns />
              ))}
            </div>
          )}
        />
        {/* <Pagination page={page} isNext={isNext || false} /> */}
      </div>
    </>
  );
};

export default FindJobs;
