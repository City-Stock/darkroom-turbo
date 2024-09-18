import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { v4 as uuidv4 } from "uuid";
import { CreateUserModel, CreateUserSchema } from "@ess/zod";
import { getFirestore } from "firebase-admin/firestore";
import { RoleModel } from "@ess/zod";
import { adminInitialize } from "../../../../firebase/serverFirebaseInstance";

// Required for function to initialize the store creds
adminInitialize();

// TODO: Authencation
type Context = {
  params: {
    userId: string;
  };
};

export async function createUser(req: NextRequest, context: Context) {
  const payload = (await req.json()) as CreateUserModel;

  console.log(payload);

  const validation = CreateUserSchema.safeParse(payload);

  if (validation.success === false)
    return NextResponse.json(
      { error: validation.error.issues },
      { status: 400 }
    );

  const { displayName, roleId, phoneNumber, email } =
    validation.data;

  try {
    const roleSnapshot = await getFirestore()
      .collection("roles")
      .doc(roleId)
      .get();

    if (!roleSnapshot.exists)
      return NextResponse.json(
        { error: [{ message: "Role doesnt exist" }] },
        { status: 400 }
      );
    const roleData = roleSnapshot.data() as RoleModel;



    // TODO: Partner org model
    const permissions: { [permission: string]: boolean } = {};

    roleData.permissions.forEach(
      (permission) => (permissions[permission.value] = true)
    );

    const user = await getAuth().createUser({
      uid: uuidv4().toLowerCase(),
      displayName,
      // TODO: Make sure correct country code
      phoneNumber: `+1${phoneNumber}`,
      email,
      emailVerified: true,
      password: uuidv4(),
    });

    await getAuth().setCustomUserClaims(user.uid, {
      permissions,
      userMetadata: {
        roleId,
        roleName: roleData.name,
      },
    });

    const resetLink = await getAuth().generatePasswordResetLink(email, {
      url: `${process.env.BASE_ADMIN_URL}/signin`,
    });

    const userWithClaims = await getAuth().getUser(user.uid);

    // TODO: Temporary Reset Link
    return NextResponse.json(
      { data: [{ ...userWithClaims, resetLink }], errors: null, page: null },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { data: [], errors: [{ message: error.message }], page: null },
      { status: error?.message.length ? 400 : 500 }
    );
  }
}
