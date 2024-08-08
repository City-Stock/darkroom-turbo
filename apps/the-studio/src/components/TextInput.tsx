import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

type Props = {
  label: string;
  placeHolder?: string;
  fieldName: string;
};

const TextInput: FC<Props> = ({ label, placeHolder, fieldName }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="w-full text-left">
      <label className="mb-2.5 block text-black dark:text-white">{label}</label>
      <input
        type="text"
        placeholder={placeHolder}
        {...register(fieldName)}
        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
      />
      <ErrorMessage errors={errors} name={fieldName} render={({ message }) => <p className="text-sm text-danger pl-2">{message}</p>} />
    </div>
  );
};

export default TextInput;
