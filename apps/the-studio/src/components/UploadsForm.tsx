import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
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

const createUploadRequest = async (data: any) => {
  const db = getFirestore(app);
  const storage = getStorage(app);
  const auth = getAuth(app);

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const storageRef = ref(storage, `uploads/${data.file.name}`);
        const uploadRequestRef = doc(collection(db, "uploads"));

        const uploadRequest = {
          approvalStatus: "pending",
          city: data.city.toLowerCase(),
          contributorName: user.displayName,
          contributorUserId: user.uid,
          ddaAssetId: "",
          ddaProductId: "",
          fileSize: data.file.size,
          fileType: data.file.type,
          isDdaLinked: false,
          isInAwsS3: false,
          isLifestyle: false,
          isLinked: false,
          isProcessed: false,
          isUploadedToShopify: false,
          isWatermarked: false,
          productName: data.productName.toLowerCase(),
          s3ImageRef: "",
          shopifyId: "",
          sourceFileName: data.file.name,
          sourceFileRef: data.file.name,
          sourceFileType: data.file.type,
          state: data.state.value.toLowerCase(),
          tags: data.tags.map((tag: any) => tag.value.toLowerCase()),
          uploadUserId: user.uid,
        };

        await uploadBytes(storageRef, data.file);
        await setDoc(uploadRequestRef, uploadRequest);

        toast.success("File uploaded successfully!");
      } catch (error) {
        toast.error("Upload failed: " + error.message);
      }
    } else {
      toast.error("User is not authenticated.");
    }
  });
};

// File example
// lastModified
// :
// 1723144580323
// lastModifiedDate
// :
// Thu Aug 08 2024 15:16:20 GMT-0400 (Eastern Daylight Time) {}
// name
// :
// "atlanta.jpg"
// size
// :
// 579406
// type
// :
// "image/jpeg"
// webkitRelativePath
// :
// ""

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

export const UploadsForm = () => {
  const methods = useForm<
    Record<string, string | File | { value: string } | { value: string }[]>
  >({
    defaultValues: {
      city: "",
      fileName: "",
      file: {},
      fileType: "",
      productName: "",
      state: "",
      tags: [],
    },
    resolver: zodResolver(formValidationSchema),
    mode: "onBlur", // Validate on blur
    reValidateMode: "onChange", // Re-validate on change
  });

  const formIsValid =
    methods.formState.isValid && (methods.watch("file") as any)?.size;

  return (
    <FormProvider {...methods}>
      <div className="p-4">
        <div className="mx-auto bg-white p-8 rounded-lg shadow-md">
          <form
            onSubmit={methods.handleSubmit(async (data) => {
              try {
                await createUploadRequest(data);
                methods.reset();
              } catch (e) {
                console.error(e);
                toast.error("Failed to create upload request");
              }
            })}
            className="space-y-4"
          >
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
                    {...field}
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
                    {...field}
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
              <p className="text-sm text-danger pl-2">
                {methods.formState.errors.tags?.message}
              </p>
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Image/Video
              </label>
              <Controller
                name="file"
                control={methods.control}
                render={({ field }) => (
                  <input
                    type="file"
                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-normal outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files?.length) {
                        methods.setValue(
                          "file",
                          files?.length ? files?.[0] : ""
                        );
                        field.onChange(files?.length ? files[0] : null);
                      }
                    }}
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
                "Submit Request"
              )}
            </button>
          </form>
        </div>
      </div>
    </FormProvider>
  );
};

export const stateOptions = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

export default UploadsForm;
