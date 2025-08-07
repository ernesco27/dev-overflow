const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  PROFILE: (id: string) => `/profile/${id}`,
  TAG: (id: string) => `/tags/${id}`,
  ASK_QUESTION: "/ask-question",
  QUESTION: (id: string) => `/questions/${id}`,
  COLLECTION: "/collections",
  COMMUNITY: "/community",
  JOBS: "/jobs",
  TAGS: "/tags",
};

export default ROUTES;
