import { PaginatedSearchParams } from "./global";

interface SignInWithOAuthParams {
  provider: "google" | "github";
  providerAccountId: string;
  user: {
    name: string;
    email: string;
    username: string;
    image: string;
  };
}

interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface CreateQuestionsParams {
  title: string;
  content: string;
  tags: string[];
}

interface EditQuestionParams extends CreateQuestionsParams {
  questionId: string;
}

interface GetQuestionParams {
  questionId: string;
}

interface GetTagQuestionsParams extends Omit<PaginatedSearchParams, "filter"> {
  tagId: string;
}
