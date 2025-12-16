import { Button } from "@/components/ui/button";
import Link from "next/link";
import ROUTES from "../../../constants/route";
import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";

import CommonFilter from "@/components/filters/CommonFilter";
import { HomePageFilters } from "../../../constants/filters";

import { Suspense } from "react";
import QuestionResults from "@/components/QuestionResults";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
  return (
    <>
      <section className="w-full flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center ">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 text-light-900!"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          placeholder="Search questions here..."
          otherClasses="flex-1"
          imgSrc="/icons/search.svg"
        />
        <CommonFilter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </section>
      <HomeFilter />
      <Suspense fallback={<div className="mt-10">Loading questions...</div>}>
        <QuestionResults searchParams={searchParams} />
      </Suspense>
    </>
  );
};

export default Home;
