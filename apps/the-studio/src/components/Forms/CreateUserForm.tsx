"use client";

import {
  CreateUserModel,
  CreateUserSchema,
  UserSchema,
} from "@ess/zod/src/schemas/UserSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import TextInput from "../TextInput";
import SelectOrgDropDown from "../SelectOrgDropDown";
import SelectRoleDropDown from "../SelectRoleDropDown";
import LoadingSpinner from "../LoadingSpinner";
import { createDtoSchema } from "@ess/zod/src/schemas/CreateDtoSchema";
import toast, { Toaster, useToaster } from "react-hot-toast";

const CreateUserForm = () => {
  const methods = useForm<CreateUserModel>({
    resolver: zodResolver(CreateUserSchema),
  });

  const onSubmit = async (data: CreateUserModel) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();
    const validateDTO = createDtoSchema(UserSchema).safeParse(responseData);

    if (!validateDTO.success) throw new Error(validateDTO.error.toString());
    if (!response.ok && validateDTO.data.errors)
      throw new Error(validateDTO.data.errors[0].message);

    methods.reset();
    return responseData;
  };

  const submit = async (data: CreateUserModel) => {
    try {
      await toast.promise(onSubmit(data), {
        loading: "Creating User...",
        success: ({ data }) => {
          return (
            <div>{`User ${data[0].displayName} created successfully`}</div>
          );
        },
        error: ({ message }) => {
          return <div>{message}</div>;
        },
      });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submit)}>
          <div className="p-6.5">
            <div className="mb-4.5">
              <TextInput
                label="Full Name"
                placeHolder="Enter your full name"
                fieldName="displayName"
              />
            </div>

            <div className="mb-4.5">
              <TextInput
                label="Email"
                placeHolder="Enter account"
                fieldName="email"
              />
            </div>

            <div className="mb-4.5">
              <TextInput
                label="Phone Number"
                placeHolder="Enter account"
                fieldName="phoneNumber"
              />
            </div>

            {/* <div className="mb-4.5">
              <SelectOrgDropDown
                label="Partner Organization"
                placeHolder="Select a Partner Organization"
                fieldName="partnerOrganizationId"
              />
            </div> */}

            <div className="mb-4.5">
              <SelectRoleDropDown
                label="Role"
                placeHolder="Select a Role"
                fieldName="roleId"
              />
            </div>
            <button
              type="submit"
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
              disabled={methods.formState.isSubmitting}
            >
              {methods.formState.isSubmitting ? (
                <LoadingSpinner color="primary" />
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateUserForm;
