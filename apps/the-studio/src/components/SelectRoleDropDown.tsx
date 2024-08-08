import { FC, useEffect } from "react";
import { FieldError, UseFormRegisterReturn, useFormContext } from "react-hook-form";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { db } from "@/firebase/clientFirebaseInstance";
import { collection } from "firebase/firestore";
import { ErrorMessage } from "@hookform/error-message";
import { RoleConverter } from "@ess/firebase/src/converters/roles/RoleConverter";

type Props = {
  label: string;
  placeHolder: string;
  fieldName: string;
};

const SelectRoleDropDown: FC<Props> = ({ label, placeHolder, fieldName }) => {
  const [roles, dataLoading, dataError, dataShapshot] = useCollectionDataOnce(collection(db, "roles").withConverter(RoleConverter));
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (roles?.length) setValue(fieldName, getValues(fieldName));
  }, [roles, fieldName, getValues, setValue]);

  return (
    <>
      <label className="mb-2.5 block text-black dark:text-white">{label}</label>
      <div className="relative z-20 bg-transparent dark:bg-form-input">
        <select
          disabled={!!dataError}
          className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          {...register(fieldName)}
        >
          <option key="placeholder-role" value="">
            {placeHolder}
          </option>
          {roles?.map((org) => (
            <option key={org.uid} value={org.uid}>
              {org.name}
            </option>
          ))}
        </select>
        <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
          <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.8">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                fill=""
              ></path>
            </g>
          </svg>
        </span>
      </div>
      <ErrorMessage errors={errors} name={fieldName} render={({ message }) => <p className="text-sm text-danger pl-2">{message}</p>} />
    </>
  );
};

export default SelectRoleDropDown;
