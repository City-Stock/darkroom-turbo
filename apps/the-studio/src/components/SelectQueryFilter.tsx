"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import ReactSelect from "react-select";

type SelectQueryFilterProps = {
  queryName: string;
  label: string;
  options: { value: string; label: string }[];
  isMulti?: boolean;
  placeholder?: string;
};

const SelectQueryFilter: FC<SelectQueryFilterProps> = ({
  queryName,
  label,
  options,
  isMulti = false,
  placeholder = "Select...",
}) => {
  const searchParams = useSearchParams()!;
  const pathname = usePathname();
  const router = useRouter();
  const paramValue = searchParams.get(queryName) ?? "";

  const [selectedOption, setSelectedOption] = useState(
    isMulti
      ? paramValue
          .split(",")
          .map((value) => options.find((option) => option.value === value))
      : options.find((option) => option.value === paramValue) || null
  );

  useEffect(() => {
    if (paramValue) {
      const parsedValue = isMulti
        ? paramValue
            .split(",")
            .map((value) => options.find((option) => option.value === value))
        : options.find((option) => option.value === paramValue);
      setSelectedOption(parsedValue || null);
    }
  }, [paramValue, options, isMulti]);

  const handleChange = (selectedOption: any) => {
    setSelectedOption(selectedOption);

    let value;
    if (isMulti) {
      value = selectedOption
        ? selectedOption.map((option: any) => option.value).join(",")
        : "";
    } else {
      value = selectedOption ? selectedOption.value : "";
    }

    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(queryName, value);
    } else {
      params.delete(queryName);
    }
    router.push(pathname + `?${params.toString()}`);
  };

  return (
    <div>
      <label className="mb-3 block text-black dark:text-white">{label}</label>
      <ReactSelect
        value={selectedOption}
        options={options}
        isMulti={isMulti}
        placeholder={placeholder}
        onChange={handleChange}
        isClearable
        styles={{
          control: (provided) => ({
            ...provided,
            paddingTop: "5px",
            paddingBottom: "5px",
          }),
        }}
      />
    </div>
  );
};

export default SelectQueryFilter;
