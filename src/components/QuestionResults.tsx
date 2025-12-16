import { getQuestions } from "@/lib/actions/question.action";
import DataRenderer from "./DataRenderer";
import { EMPTY_QUESTION } from "../../constants/states";
import QuestionCard from "./cards/QuestionCard";
import Pagination from "./Pagination";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const QuestionResults = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const { questions, isNext } = data || {};
  return (
    <>
      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />
      <Pagination page={page} isNext={isNext || false} />
    </>
  );
};

export default QuestionResults;
