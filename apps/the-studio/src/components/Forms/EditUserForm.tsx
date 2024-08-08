"use client";

import {
  CreateUserModel,
  CreateUserSchema,
  EditUserModel,
  EditUserSchema,
  UserModel,
  UserSchema,
} from "@ess/zod/src/schemas/UserSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import TextInput from "../TextInput";
import SelectOrgDropDown from "../SelectOrgDropDown";
import SelectRoleDropDown from "../SelectRoleDropDown";
import LoadingSpinner from "../LoadingSpinner";
import { createDtoSchema } from "@ess/zod/src/schemas/CreateDtoSchema";
import { redirect, useParams } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const EditUserForm = () => {
  const methods = useForm<CreateUserModel>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: async () => getUserDefaultValues(),
  });
  const { push } = useRouter();
  const { userId } = useParams();
  const { currentUserIdToken } = useContext(AuthContext);

  // console.log(userId.toString().toLocaleLowerCase(), "LOOK");
  // const [user, setUser] = useState<UserModel | null>(null);

  // const getUser = useCallback(async () => {
  //   try {
  //     const response = await fetch(`/api/users/${userId}`, {
  //       method: "GET",
  //       headers: {
  //         authorization: `Bearer ${currentUserIdToken}`,
  //       },
  //     });

  //     const data = await response.json();
  //     const validateDTO = createDtoSchema(UserSchema).safeParse(data);

  //     if (!validateDTO.success) throw new Error(validateDTO.error.toString());
  //     if (!response.ok && validateDTO.data.errors) throw new Error(validateDTO.data.errors[0].message);
  //     if (!validateDTO.data.data.length) throw new Error("User not found");

  //     setUser(validateDTO.data.data[0]);
  //     return validateDTO.data.data[0];
  //   } catch (error) {
  //     console.log(error);
  //     alert("Failed to fetch user");
  //   }
  // }, [currentUserIdToken, userId]);

  const getUserDefaultValues = async (): Promise<EditUserModel> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users/${userId}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${currentUserIdToken}`,
          },
        }
      );

      const data = await response.json();

      const validateDTO = createDtoSchema(UserSchema).safeParse(data);

      if (!validateDTO.success) throw new Error(validateDTO.error.toString());
      if (!response.ok && validateDTO.data.errors)
        throw new Error(validateDTO.data.errors[0].message);
      if (!validateDTO.data.data.length) throw new Error("User not found");

      const { displayName, phoneNumber, email, customClaims } =
        validateDTO.data.data[0];

      return {
        displayName,
        phoneNumber,
        email,
        partnerOrganizationId: customClaims.userMetadata.partnerOrganizationId,
        roleId: customClaims.userMetadata.roleId,
      };
    } catch (error) {
      console.log(error);

      return {
        displayName: "",
        phoneNumber: "",
        email: "",
        partnerOrganizationId: "",
        roleId: "",
      };
    }
  };

  const handleDelete = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${currentUserIdToken}`,
        },
      }
    );
    const responseData = await response.json();
    return responseData;
  };

  const deleteUser = async () => {
    try {
      await toast.promise(handleDelete(), {
        loading: "Deleting User...",
        success: ({ data }) => {
          console.log(data, "look here");
          return <div>{`User deleted successfully`}</div>;
        },
        error: ({ message }) => {
          return <div>{message}</div>;
        },
      });
      push("/users");
    } catch (error: any) {
      console.log(error.message);
      methods.reset();
    }
  };

  const onSubmit = async (data: CreateUserModel) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users/${userId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.errors[0].message);
    }

    const validateDTO = createDtoSchema(EditUserSchema).safeParse(responseData);
    if (!validateDTO.success) throw new Error(validateDTO.error.toString());

    if (!response.ok && validateDTO.data.errors)
      throw new Error(validateDTO.data.errors[0].message);

    return responseData;
  };

  const submit = async (data: CreateUserModel) => {
    try {
      await toast.promise(onSubmit(data), {
        loading: "Updating User...",
        success: ({ data }) => {
          console.log(data, "look here");
          return <div>{`User updated successfully`}</div>;
        },
        error: ({ message }) => {
          return <div>{message}</div>;
        },
      });
    } catch (error: any) {
      console.log(error.message);
      methods.reset();
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          Edit User: {methods.getValues("displayName") ?? "Loading..."}
        </h3>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submit)}>
          <div className="p-6.5">
            <div className="mb-4.5">
              <TextInput
                label="Full Name"
                placeHolder="Loading..."
                fieldName="displayName"
              />
            </div>

            <div className="mb-4.5">
              <TextInput
                label="Email"
                placeHolder="Loading..."
                fieldName="email"
              />
            </div>

            <div className="mb-4.5">
              <TextInput
                label="Phone Number"
                placeHolder="Loading..."
                fieldName="phoneNumber"
              />
            </div>

            <div className="mb-4.5">
              <SelectOrgDropDown
                label="Partner Organization"
                placeHolder={
                  !methods.getValues("partnerOrganizationId")
                    ? "Loading..."
                    : "Select a Partner Organization"
                }
                fieldName="partnerOrganizationId"
              />
            </div>

            <div className="mb-4.5">
              <SelectRoleDropDown
                label="Role"
                placeHolder={
                  !methods.getValues("roleId") ? "Loading..." : "Select a Role"
                }
                fieldName="roleId"
              />
            </div>
            <button
              type="submit"
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
              disabled={methods.formState.isSubmitting}
            >
              {methods.formState.isSubmitting ? (
                <LoadingSpinner message="Updating..." color="white" />
              ) : (
                "Update"
              )}
            </button>
            <button
              className="flex w-full justify-center rounded bg-danger p-3 mt-5 font-medium text-gray"
              // disabled={methods.formState.isSubmitting}
              type="button"
              onClick={deleteUser}
            >
              Delete User
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default EditUserForm;
