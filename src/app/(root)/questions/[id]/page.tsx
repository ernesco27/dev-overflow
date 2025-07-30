import React from "react";
import { RouteParams } from "../../../../../types/global";

const QuestionDetails = async ({ params }: RouteParams) => {
  const { id } = await params;
  return <div>Question ID: {id}</div>;
};

export default QuestionDetails;
