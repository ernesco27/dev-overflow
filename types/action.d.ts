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

interface GetTagQuestionsParams extends PaginatedSearchParams {
  tagId: string;
}

interface IncrementViewsParams {
  questionId: string;
}

interface CreateAnswerParams {
  questionId: string;
  content: string;
}

interface GetAnswersParams extends PaginatedSearchParams {
  questionId: string;
}

interface CreateVoteParams {
  targetId: string;
  targetType: "question" | "answer";
  voteType: "upvote" | "downvote";
}

interface UpdateVoteParams extends CreateVoteParams {
  change: 1 | -1;
}

type HasVotedParams = Pick<CreateVoteParams, "targetId" | "targetType">;

interface HasVotedResponse {
  hasUpVoted: boolean;
  hasDownVoted: boolean;
}

interface CollectionBaseParams {
  questionId: string;
}

interface GetUserParams {
  userId: string;
}
