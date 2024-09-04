"use client";
import Link from "next/link";
import { FC, Suspense } from "react";
import { SWRConfig } from "swr";
import UploadsTable from "./UploadsTable";
import UploadsForm from "./UploadsForm";
import MultiUploadForm from "./MultiUploadForm";
import UserUploadsTable from "./UserUploadsTable";

type Props = {
  searchParams?: { [key: string]: string | undefined };
};

const UploadsPageNavTabs: FC<Props> = ({ searchParams }) => {
  const openTab = searchParams?.tab ?? "search";
  const activeClasses = "text-primary border-primary";
  const inactiveClasses = "border-transparent";

  return (
    <div className="">
      <div className="mb-6 flex flex-wrap gap-5 border-b border-stroke dark:border-strokedark sm:gap-10">
        <Link
          href="/uploads?tab=search"
          className={`border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base ${
            openTab === "search" ? activeClasses : inactiveClasses
          }`}
        >
          My Uploads
        </Link>
        <Link
          href="/uploads?tab=multi-upload"
          className={`border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base ${
            openTab === "multi-upload" ? activeClasses : inactiveClasses
          }`}
        >
          Multi-Upload
        </Link>
        <Link
          href="/uploads?tab=single-upload"
          className={`border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base ${
            openTab === "single-upload" ? activeClasses : inactiveClasses
          }`}
        >
          Single-Upload
        </Link>
      </div>

      <SWRConfig value={{ suspense: true }}>
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
          }
        >
          <div>
            <div
              className={`leading-relaxed ${
                openTab === "search" ? "block" : "hidden"
              }`}
            >
              <UserUploadsTable />
            </div>
            <div
              className={`leading-relaxed ${
                openTab === "multi-upload" ? "block" : "hidden"
              }`}
            >
              <MultiUploadForm />
            </div>
            <div
              className={`leading-relaxed ${
                openTab === "single-upload" ? "block" : "hidden"
              }`}
            >
              <UploadsForm />
            </div>
          </div>
        </Suspense>
      </SWRConfig>
    </div>
  );
};

export default UploadsPageNavTabs;
