import Image from "next/image";
import React, { useState, useRef, MouseEvent } from "react";
import addIcon from "@/assets/svgs/addIcon.svg";
import TextInput from "./TextInput";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateRoleSchema } from "@ess/zod/src/schemas/RoleSchema";
import { z } from "zod";
import {
  addDoc,
  collection,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "@/firebase/clientFirebaseInstance";
import LoadingSpinner from "./LoadingSpinner";
import { CreateRoleConverter } from "@ess/firebase/src/converters/roles/CreateRoleConverter";
import toast from "react-hot-toast";

const CreateRoleFormSchema = CreateRoleSchema.pick({ name: true });
type CreateRoleFormModel = z.infer<typeof CreateRoleFormSchema>;

const CreateRoleModal: React.FC = () => {
  const methods = useForm<CreateRoleFormModel>({
    resolver: zodResolver(CreateRoleFormSchema),
  });
  const [modalOpen, setModalOpen] = useState(false);

  const trigger = useRef<any>(null);
  const modal = useRef<any>(null);

  const onSubmit = async (data: CreateRoleFormModel) => {
    if (!auth?.currentUser) return alert("Missing user id");

    await addDoc(collection(db, "roles").withConverter(CreateRoleConverter), {
      ...data,
      permissions: [],
      createdBy: auth.currentUser.uid,
      createdOn: serverTimestamp(),
      modifiedBy: auth.currentUser.uid,
      modifiedOn: serverTimestamp(),
    });

    methods.reset();
    setModalOpen(false);
  };

  const onCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    methods.reset();
    setModalOpen(false);
  };
  const submit = async (data: CreateRoleFormModel) => {
    try {
      await toast.promise(onSubmit(data), {
        loading: "Creating Role...",
        success: () => {
          console.log(data, "look here");
          return <div>{`Role created successfully`}</div>;
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
            Create a Role
          </h3>
          <span className="mx-auto mb-6 inline-block h-1 w-1/3 rounded bg-primary"></span>
          <div className="text-sm text-body">
            Assign permissions after creation
          </div>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(submit)}
              className="mb-10 flex flex-col gap-4"
            >
              <TextInput label="Name" placeHolder="Standard" fieldName="name" />
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

export default CreateRoleModal;
