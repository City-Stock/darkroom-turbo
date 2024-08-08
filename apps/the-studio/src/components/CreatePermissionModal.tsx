import Image from "next/image";
import React, { useState, useEffect, useRef, MouseEvent } from "react";
import addIcon from "@/assets/svgs/addIcon.svg";
import TextInput from "./TextInput";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePermissionSchema } from "@ess/zod/src/schemas/PermissionSchema";
import { z } from "zod";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "@/firebase/clientFirebaseInstance";
import { PermissionConverter } from "@ess/firebase/src/converters/permissions/PermissionConverter";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";

const CreatePermissionFormSchema = CreatePermissionSchema.pick({
  value: true,
  description: true,
});
type CreatePermissionFormModel = z.infer<typeof CreatePermissionFormSchema>;

const CreatePermissionModal: React.FC = () => {
  const methods = useForm<CreatePermissionFormModel>({
    resolver: zodResolver(CreatePermissionFormSchema),
  });
  const [modalOpen, setModalOpen] = useState(false);

  const trigger = useRef<any>(null);
  const modal = useRef<any>(null);

  const onSubmit = async (data: CreatePermissionFormModel) => {
    if (!auth?.currentUser) return alert("Missing user id");
    const newPermissionRef = collection(db, "permissions");

    await addDoc(
      collection(db, "permissions").withConverter(PermissionConverter),
      {
        ...data,
        uid: newPermissionRef.id,
        createdBy: auth.currentUser.uid,
        createdOn: serverTimestamp(),
        modifiedBy: auth.currentUser.uid,
        modifiedOn: serverTimestamp(),
      }
    );

    methods.reset();
    setModalOpen(false);
  };

  const submit = async (data: CreatePermissionFormModel) => {
    try {
      await toast.promise(onSubmit(data), {
        loading: "Creating Permission...",
        success: () => {
          return <div>{`Permission created successfully`}</div>;
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

  const onCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    methods.reset();
    setModalOpen(false);
  };

  return (
    <div>
      <button
        ref={trigger}
        onClick={() => setModalOpen(!modalOpen)}
        className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 "
      >
        <span>
          <Image src={addIcon} width={25} height={25} alt="" />
        </span>
        Add
      </button>
      <div
        className={`fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${
          modalOpen ? "block" : "hidden"
        }`}
      >
        <div
          ref={modal}
          className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5"
        >
          <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
            Create a Permission
          </h3>
          <span className="mx-auto mb-6 inline-block h-1 w-1/2 rounded bg-primary"></span>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(submit)}
              className="mb-10 flex flex-col gap-4"
            >
              <TextInput
                label="Value"
                placeHolder="ex. create:user"
                fieldName="value"
              />
              <TextInput
                label="Description"
                placeHolder="ex. create:user"
                fieldName="description"
              />
              <div className="-mx-3 flex flex-wrap gap-y-4">
                <div className="w-full px-3 2xsm:w-1/2">
                  <button
                    onClick={onCancel}
                    className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
                  >
                    Cancel
                  </button>
                </div>
                <div className="w-full px-3 2xsm:w-1/2">
                  <button
                    type="submit"
                    className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                  >
                    {methods.formState.isSubmitting ? (
                      <LoadingSpinner message="Creating..." color="white" />
                    ) : (
                      "Create"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default CreatePermissionModal;
