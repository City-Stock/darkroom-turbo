import { NextRequest, NextResponse } from "next/server";
import { UserRecord, getAuth } from "firebase-admin/auth";
import { adminInitialize } from "../../../../firebase/serverFirebaseInstance";
import { UserSchema } from "@ess/zod";

// Required for function to initialize the store creds
adminInitialize();

type GetSearchParams = {
  name?: string;
  email?: string;
  phone?: string;
  partnerOrganizationName?: string;
};

// TODO: Authencation

export async function getUsers(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  let users: UserRecord[] = [];
  let nextPage: string | null = null;

  // Get all users
  try {
    const usersResult = await getAuth().listUsers(1000, "1");

    usersResult.users.forEach((user) => users.push(user));
    nextPage = usersResult.pageToken ?? null;
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ data: [], errors: error.message, page: 0 }, { status: 500 });
  }

  // Filter down the users
  if (searchParams.has("email")) users = users.filter((user) => user.email?.toLowerCase().includes(searchParams.get("email")?.toLowerCase() as string));
  if (searchParams.has("displayName"))
    users = users.filter((user) => user.displayName?.toLowerCase().includes(searchParams.get("displayName")?.toLowerCase() as string));
  if (searchParams.has("phone")) users = users.filter((user) => user.phoneNumber?.toLowerCase().includes(searchParams.get("phone")?.toLowerCase() as string));

  // Parse user data and return
  try {
    const usersParsed = users.map((user) => UserSchema.parse(user));

    return NextResponse.json({ data: usersParsed, page: nextPage, erros: null }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ data: [], errors: {message: "A user is not properly setup. Please fix"}, page: 0 }, { status: 500 });
  }
}
