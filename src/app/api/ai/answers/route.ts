import handleError from "@/lib/handlers/error";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { APIErrorResponse } from "../../../../../types/global";
import { AIAnswerSchema } from "@/lib/validations";
import { ValidationError } from "@/lib/http-errors";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { question, content } = await req.json();

  try {
    const validatedData = AIAnswerSchema.safeParse({ question, content });
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { text } = await generateText({
      model: google("gemini-2.5-pro"),
      prompt: `Generate a markdown-formatted response to the following question: ${question}. Base it on the provided content: ${content}`,
      system:
        "You are a helpful assistant that provides informative responses in markdown format. Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary. For code blocks, use short-form smaller case language identifiers (e.g., 'js' for JavaScript, 'py' for Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS, etc.). Ensure the response is clear, concise, and well-structured to enhance readability.",
    });

    return NextResponse.json({ success: true, data: text }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
