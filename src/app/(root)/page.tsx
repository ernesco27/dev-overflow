import { Button } from "@/components/ui/button";
import Link from "next/link";
import ROUTES from "../../../constants/route";
import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import QuestionCard from "@/components/cards/QuestionCard";
import { auth } from "../../../auth";

const questions = [
  {
    _id: "1",
    title: "What is the best way to learn React?",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "Nextjs" },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      image:
        "https://static.vecteezy.com/system/resources/thumbnails/006/487/917/small_2x/man-avatar-icon-free-vector.jpg",
    },

    upVotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "How to optimize performance in Next.js?",
    tags: [
      { _id: "3", name: "Next.js" },
      { _id: "4", name: "React" },
    ],
    author: {
      _id: "2",
      name: "Jane Smith",
      image:
        "https://static.vecteezy.com/system/resources/previews/014/194/216/non_2x/avatar-icon-human-a-person-s-badge-social-media-profile-symbol-the-symbol-of-a-person-vector.jpg",
    },

    upVotes: 8,
    answers: 3,
    views: 75,
    createdAt: new Date(),
  },
];

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
  const session = await auth();

  console.log("session: ", session);

  const { query = "", filter = "" } = await searchParams;

  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesFilter = filter
      ? question.tags[0].name.toLowerCase() === filter.toLowerCase()
      : true;
    return matchesQuery && matchesFilter;
  });

  return (
    <>
      <section className="w-full flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center ">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/"
          placeholder="Search questions here..."
          otherClasses="flex-1"
          imgSrc="/icons/search.svg"
        />
      </section>
      <HomeFilter />
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </div>
    </>
  );
};

export default Home;
