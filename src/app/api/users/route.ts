import handleError from "@/lib/handlers/error";
import dbConnect from "@/lib/mongoose";
import User from "../../../../database/user.model";
import { NextResponse } from "next/server";
import { APIErrorResponse } from "../../../../types/global";
import { UserSchema } from "@/lib/validations";
import { ValidationError } from "@/lib/http-errors";

export async function GET() {
  try {
    await dbConnect();

    const users = await User.find();

    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// Create User

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const validatedData = UserSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { email, username } = validatedData.data;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) throw new Error("User already exists");

    const newUser = await User.create(validatedData.data);

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    handleError(error, "api") as APIErrorResponse;
  }
}
