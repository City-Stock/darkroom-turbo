import { NextRequest, NextResponse } from "next/server";
import { UserRecord, getAuth } from "firebase-admin/auth";
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
  displayName: string;
  phoneNumber: string;
  email: string;
  partnerOrganizationId: string;
  partnerOrganizationName: string;
  roleId: string;
  roleName: string;
};

export async function updateUser(req: NextRequest, context: Context) {
  const userId = context.params.userId;
  const {
    displayName,
    phoneNumber,
    email,
    partnerOrganizationId,
    roleId,
    roleName,
    partnerOrganizationName,
  } = (await req.json()) as Payload;

  if (
    !displayName ||
    !phoneNumber ||
    !email ||
    !roleId
  )
    return NextResponse.json(
      { data: [], errors: [{ message: "missing fields" }], page: null },
      { status: 400 }
    );

  let updatedUser: null | UserRecord = null;

    try {
      const user = await getAuth().getUser(userId);

      await getAuth().setCustomUserClaims(userId, {
        permissions: user.customClaims?.permissions,
        userMetadata: {
          partnerOrganizationId,
          roleId,
          roleName
        },
      });
    } catch (error: any) {
      console.log(error);
      return NextResponse.json(
        { data: [], errors: [{ message: error.message }] },
        { status: 500 }
      );
    }

  if (displayName || phoneNumber || email) {
    try {
      updatedUser = await getAuth().updateUser(userId, {
        displayName,
        phoneNumber: phoneNumber.includes("+1")
          ? phoneNumber
          : `+1${phoneNumber}`,
        email,
      });
    } catch (error: any) {
      console.log(error);
      return NextResponse.json(
        { data: [], errors: [{ message: error.message }] },
        { status: 500 }
      );
    }
  }

  const valuesToUpdate = {
    displayName: updatedUser?.displayName,
    phoneNumber: updatedUser?.phoneNumber,
    email: updatedUser?.email,
    partnerOrganizationId: updatedUser?.customClaims
      ? updatedUser.customClaims.userMetadata.partnerOrganizationId
      : "",
    roleId: updatedUser?.customClaims
      ? updatedUser?.customClaims.userMetadata.roleId
      : "",
      roleName: updatedUser?.customClaims
      ? updatedUser?.customClaims.userMetadata.roleName
      : "",
  };

  return NextResponse.json(
    { data: [valuesToUpdate], page: 0, errors: [] },
    { status: 200 }
  );
}
