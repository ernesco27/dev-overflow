import dbConnect from "@/lib/mongoose";
import Account from "../../../../database/account.model";
import { NextResponse } from "next/server";
import handleError from "@/lib/handlers/error";
import { ForbiddenError } from "@/lib/http-errors";

import { APIErrorResponse } from "../../../../types/global";
import { AccountSchema } from "@/lib/validations";

export async function GET() {
  try {
    await dbConnect();

    const accounts = await Account.find();

    return NextResponse.json(
      { success: true, data: accounts },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// Create Account

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const validatedData = AccountSchema.parse(body);

    const existingAccount = await Account.findOne({
      provider: validatedData.provider,
      providerAccountId: validatedData.providerAccountId,
    });

    if (existingAccount) throw new ForbiddenError("Account already exists");

    const newAccount = await Account.create(validatedData);

    return NextResponse.json(
      { success: true, data: newAccount },
      { status: 201 }
    );
  } catch (error) {
    handleError(error, "api") as APIErrorResponse;
  }
}
