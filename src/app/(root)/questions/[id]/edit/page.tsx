import QuestionForm from "@/components/forms/QuestionForm";
import React from "react";

import { notFound, redirect } from "next/navigation";
import { auth } from "../../../../../../auth";
import { RouteParams } from "../../../../../../types/global";
import { getQuestion } from "@/lib/actions/question.action";
import ROUTES from "../../../../../../constants/route";

const EditQuestion = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();

  const session = await auth();
  if (!session) return redirect("sign-in");

  const { data: question, success } = await getQuestion({ questionId: id });
  if (!success) return notFound();

  if (question.author.toString() !== session?.user?.id) {
    return redirect(ROUTES.QUESTION(id));
  }

  return (
    <main>
      <div className="mt-9">
        <QuestionForm question={question} isEdit />
      </div>
    </main>
  );
};

export default EditQuestion;
