import CommonFilter from "@/components/filters/CommonFilter";
import LocalSearch from "@/components/search/LocalSearch";

import { getCountries } from "@/lib/actions/countries.action";

import { Suspense } from "react";
import JobResults from "@/components/JobResults";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const FindJobs = async ({ searchParams }: SearchParams) => {
  const { data: countriesData } = await getCountries();

  const countries = countriesData!.countries
    .map((country) => ({
      name: country.name.common,
      value: country.cca2,
      svg: country.flags.svg,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

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
        <Suspense fallback={<div className="mt-10">Loading jobs...</div>}>
          <JobResults searchParams={searchParams} />
        </Suspense>

        {/* <Pagination page={page} isNext={isNext || false} /> */}
      </div>
    </>
  );
};

export default FindJobs;
