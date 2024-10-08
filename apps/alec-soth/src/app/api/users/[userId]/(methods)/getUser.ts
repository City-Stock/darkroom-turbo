import { NextRequest, NextResponse } from "next/server";
import { UserRecord, getAuth } from "firebase-admin/auth";
import { UserSchema } from "@ess/zod";
import { adminInitialize } from "../../../../../firebase/serverFirebaseInstance";

// Required for function to initialize the store creds
adminInitialize();

// TODO: Authencation
type Context = {
  params: {
    userId: string;
  };
};

type Payload = {
  displayName?: string;
  phoneNumber?: string;
  email?: string;
  partnerOrganizationId?: string;
  partnerOrganizationName?: string;
};

export async function getUser(req: NextRequest, context: Context) {
  const userId = context.params.userId;
  const idToken = req.headers
    .get("authorization")
    ?.replace("Bearer", "")
    .trim();
  if (!userId || !idToken)
    return NextResponse.json(
      {
        data: null,
        page: 0,
        errors: [{ message: "Missing token or user id" }],
      },
      { status: 401 }
    );

    console.log(userId, idToken);

  // Verify Token & decode
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);

    if (!decodedToken?.permissions["read:user"])
      return NextResponse.json(
        {
          data: null,
          page: 0,
          errors: [{ message: "Missing token or user id" }],
        },
        { status: 401 }
      );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { data: [], page: null, errors: [{ message: error.message }] },
      { status: 401 }
    );
  }

  // Get User Info from Auth
  try {
    const user = await getAuth().getUser(userId);

    // const parsedUser = UserSchema.parse(user);

    return NextResponse.json(
      { data: [user], page: 0, errors: [] },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { data: [], page: null, errors: [{ message: error.message }] },
      { status: 500 }
    );
  }
}
