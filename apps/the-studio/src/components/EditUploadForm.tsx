"use client";

import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ReactSelect from "react-select";
import LoadingSpinner from "./LoadingSpinner";
import TextInput from "./TextInput";

import { app } from "@/firebase/clientFirebaseInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { z } from "zod";
import { stateOptions } from "./UploadsForm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";

const editUploadRequest = async (data: any, docId: string) => {
  const db = getFirestore(app);
  const auth = getAuth(app);

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const uploadRequestRef = doc(db, "uploads", docId);
        await setDoc(
          uploadRequestRef,
          {
            city: data?.city,
            productName: data?.productName,
            state: data?.state,
            tags: data?.tags,
          },
          { merge: true }
        );

        toast.success("Upload request created successfully");
      } catch (e) {
        toast.error("Failed to create upload request");
      }
    } else {
      toast.error("User is not authenticated.");
    }
  });
};

const formValidationSchema = z.object({
  city: z
    .string()
    .nonempty("City is a required field")
    .min(3, "City name is too short"),
  file: z.any(),
  productName: z
    .string()
    .nonempty("Product Name is a required field")
    .min(3, "Product name is too short"),
  state: z.object({
    value: z.string().nonempty("Please select a state"),
    label: z.string().nonempty("Please select a state"),
  }),
  tags: z
    .array(
      z.object({
        value: z.string().nonempty(),
        label: z.string().nonempty(),
      })
    )
    .nonempty("Please select at least one tag"),
});

const useGetUpload = () => {
  const params = useParams();

  const [upload, setUpload] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);

  useEffect(() => {
    if (!params.id) {
      setLoading(false);
      return;
    }

    const getUpload = async () => {
      const uploadRef = doc(db, "uploads", params.id as string);
      const uploadSnap = await getDoc(uploadRef);

      const storage = getStorage();
      const imageRef = ref(
        storage,
        `uploads/${uploadSnap.data()?.sourceFileName}`
      );

      const url = await getDownloadURL(imageRef);

      if (uploadSnap.exists()) {
        setUpload({ ...uploadSnap.data(), cardImage: url });
      }

      setLoading(false);
    };

    getUpload();
  }, [params.id]);

  return { upload, loading };
};

export const EditUploadForm = () => {
  const { upload, loading } = useGetUpload();
  const params = useParams();

  const isVideo = upload?.fileType.split("/")[0] === "video";

  const methods = useForm({
    resolver: zodResolver(formValidationSchema),
    mode: "onBlur", // Validate on blur
    reValidateMode: "onChange", // Re-validate on change
  });

  // form is valid if there is a difference between the default values and the form values
  const formIsValid = Object.keys(methods.formState.dirtyFields).length > 0;

  useEffect(() => {
    // Reset form with default values when they change
    methods.reset({
      city: upload?.city,
      productName: upload?.productName,
      state: {
        value: upload?.state,
        label:
          stateOptions.find((option) => option.value === upload?.state)
            ?.label || "",
      },
      tags: upload?.tags?.map((tag: string) => ({
        value: tag,
        label: tag,
      })),
    });
  }, [upload]);

  return (
    <FormProvider {...methods}>
      <div className="p-4">
        <div className="mx-auto bg-white p-8 rounded-lg shadow-md">
          <form
            onSubmit={methods.handleSubmit(async (data) => {
              try {
                if (!params?.id) {
                  throw new Error("Upload ID not found");
                }

                const payload = {
                  city: data?.city,
                  productName: data?.productName,
                  state: data?.state.value,
                  tags: data?.tags?.map((tag) => tag.value),
                };

                await editUploadRequest(payload, params.id as string);
              } catch (e) {
                console.error(e);
                toast.error("Failed to create upload request");
              }
            })}
            className="space-y-4"
          >
            <label className="mb-2.5 block text-black dark:text-white">
              Image/Video
            </label>
            {upload?.cardImage ? (
              isVideo ? (
                <video
                  className="rounded-md h-[96px] w-[96px] object-cover"
                  preload="metadata"
                >
                  <source src={upload?.cardImage} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  className="rounded-md h-[96px] w-[96px] object-cover"
                  width={96}
                  height={96}
                  src={upload?.cardImage || ""}
                  alt="Cards"
                />
              )
            ) : (
              <Skeleton
                className="rounded-md h-[96px] w-[96px] object-cover"
                height={96}
              />
            )}
            <TextInput fieldName="productName" label="Product Name" />
            <TextInput fieldName="city" label="City" />
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                State
              </label>
              <Controller
                name="state"
                control={methods.control}
                render={({ field }) => (
                  <ReactSelect
                    {...(field as any)}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        paddingTop: "5px",
                        paddingBottom: "5px",
                      }),
                    }}
                    placeholder="Select State"
                    options={stateOptions}
                    onChange={(selectedOption) =>
                      field.onChange(selectedOption)
                    }
                  />
                )}
              />
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Tags
              </label>
              <Controller
                name="tags"
                control={methods.control}
                render={({ field }) => (
                  <ReactSelect
                    {...(field as any)}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        paddingTop: "5px",
                        paddingBottom: "5px",
                      }),
                    }}
                    placeholder="Select Tags"
                    options={[
                      { value: "tag1", label: "Tag 1" },
                      { value: "tag2", label: "Tag 2" },
                      { value: "tag3", label: "Tag 3" },
                    ]}
                    isMulti
                    isSearchable
                    onChange={(selectedOptions) =>
                      field.onChange(selectedOptions)
                    }
                  />
                )}
              />
            </div>
            <button
              type="submit"
              className={classNames(
                "flex w-full justify-center rounded bg-primary p-3 font-medium text-gray",
                {
                  "opacity-50 cursor-not-allowed":
                    methods.formState.isSubmitting || !formIsValid,
                }
              )}
              disabled={methods.formState.isSubmitting}
            >
              {methods.formState.isSubmitting ? (
                <LoadingSpinner color="primary" />
              ) : (
                "Edit Upload"
              )}
            </button>
          </form>
        </div>
      </div>
    </FormProvider>
  );
};

export default EditUploadForm;
