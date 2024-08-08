"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";

type Props = {
  queryName: string;
  label: string;
};

const QueryFilter: FC<Props> = ({ queryName, label }) => {
  const searchParams = useSearchParams()!;
  const pathname = usePathname();
  const router = useRouter();
  const paramValue = searchParams.get(queryName) ?? "";

  const [searchTerm, setSearchTerm] = useState(paramValue);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(ev.target.value);
  };

  useEffect(() => {
    if (debouncedSearchTerm.length) {
      const params = new URLSearchParams(searchParams.toString());

      params.set(queryName, debouncedSearchTerm);
      router.push(pathname + `?${params.toString()}`);
    } else {
      const params = new URLSearchParams(searchParams.toString());

      params.delete(queryName);
      router.push(pathname + `?${params.toString()}`);
    }
  }, [debouncedSearchTerm, pathname, queryName, router, searchParams]);

  return (
    <div>
      <label className="mb-3 block text-black dark:text-white">{label}</label>
      <input
        type="text"
        defaultValue={paramValue}
        onChange={handleChange}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
      />
    </div>
  );
};

export default QueryFilter;
