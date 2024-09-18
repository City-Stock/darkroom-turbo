import { getFirestore } from "firebase-admin/firestore";
import { DecodedIdToken, UserRecord, getAuth } from "firebase-admin/auth";
import { RoleModel } from "@ess/zod";
import { NextRequest, NextResponse } from "next/server";
import { adminInitialize } from "../../../../../firebase/serverFirebaseInstance";

// Required for function to initialize the store creds
adminInitialize();

type Data = {
  user?: UserRecord;
  error?: string;
};

export async function createCustomToken(request: NextRequest) {
  console.log("test");
  const { idToken } = await request.json();

  let decodedToken: DecodedIdToken | null = null;
  let userRole: RoleModel | null = null;

  try {
    decodedToken = await getAuth().verifyIdToken(idToken);
  } catch (error: any) {
    return NextResponse.json({ errors: error.message }, { status: 401 });
  }

  if (!decodedToken) {
    return NextResponse.json({ error: "Invalid Id Token" }, { status: 403 });
  }

  // Get Admin User Creds
  try {
    const querySnapshot = await getFirestore().collection("roles").where("name", "==", "Admin").get();

    let role: null | RoleModel = null;

    if (querySnapshot.empty) throw Error("Unable to find Admin role");
    if (querySnapshot.size !== 1) throw Error("More than 1 Admin Role found.");

    querySnapshot.forEach((snapshot) => (role = snapshot.data() as RoleModel));

    if (role) userRole = role as RoleModel;
  } catch (error: any) {
    return NextResponse.json({ errors: error.message }, { status: 500 });
  }

  if (!userRole) {
    return NextResponse.json({ error: "permission not found" }, { status: 403 });
  }

  const userPermissions = arrayToObject(userRole.permissions.map((permission) => permission.value));
  // console.log("userPermissions", userPermissions);
  // console.log("decodedToken", decodedToken.uid);

  try {
    const customToken = await getAuth().createCustomToken(decodedToken.uid, {
      permissions: decodedToken?.permissions,
      userMetadata: decodedToken?.userMetadata,
    });
    console.log("test");
    return NextResponse.json(
      { accessToken: customToken },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json({ errors: error.message }, { status: 500 });
  }
}

// Help Function
const arrayToObject = (arr: string[]): { [key: string]: boolean } => {
  return arr.reduce<{ [key: string]: boolean }>((obj, item) => {
    obj[item] = true;
    return obj;
  }, {});
};
