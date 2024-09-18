import { UserRecord, getAuth } from "firebase-admin/auth";
import { adminInitialize } from "../../../../firebase/serverFirebaseInstance";
import { NextRequest, NextResponse } from "next/server";

// Required for function to initialize the store creds
adminInitialize();

type Data = {
  user?: UserRecord;
  error?: string;
};

export async function POST(req: NextRequest) {
  // const { email, password } = req.body;
  let createdUser: UserRecord | null = null;

  // try {
  //   const user = await getAuth().createUser({
  //     email,
  //     password,
  //   });

  //   console.log(user);

  //   res.status(200).json({ user });
  // } catch (error: any) {
  //   res.status(500).json({ errors: error.message });
  // }

  const userId = "71qMtcOWzmVJbzAD0L14ocYpsFk1";

  // try {
  //   await getAuth().setCustomUserClaims(userId, {
  //     admin: true,
  //   });

  //   res.status(201).json({});
  // } catch (error: any) {
  //   res.status(500).json({ errors: error.message });
  // }

  try {
    const user = await getAuth().getUser(userId);

    console.log(user);

    NextResponse.json({ data: [user], page: null, errors: null }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ data: [], page: null, errors: [{ message: error.message }] }, { status: 500 });
  }
}
