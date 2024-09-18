"use client";
import React, { FC, Suspense, useState } from "react";
import Link from "next/link";
import UsersTable from "./UsersTable";
import CreateUserForm from "./Forms/CreateUserForm";
import { SWRConfig } from "swr";
import UsersTablePayouts from "./UsersTablePayouts";

type Props = {
  searchParams?: { [key: string]: string | undefined };
};

const UsersPageNavTabs: FC<Props> = ({ searchParams }) => {
  const openTab = searchParams?.tab ?? "search";
  const activeClasses = "text-primary border-primary";
  const inactiveClasses = "border-transparent";

  return (
    <div className="">
      <div className="mb-6 flex flex-wrap gap-5 border-b border-stroke dark:border-strokedark sm:gap-10">
        <Link
          href="/users?tab=search"
          className={`border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base ${
            openTab === "search" ? activeClasses : inactiveClasses
          }`}
        >
          Search Users
        </Link>
        <Link
          href="/users?tab=add"
          className={`border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base ${
            openTab === "add" ? activeClasses : inactiveClasses
          }`}
        >
          Add User
        </Link>
        <Link
          href="/users?tab=payouts"
          className={`border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base ${
            openTab === "payouts" ? activeClasses : inactiveClasses
          }`}
        >
          Payouts
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
              <UsersTable searchParams={searchParams} />
            </div>
            <div
              className={`leading-relaxed ${
                openTab === "payouts" ? "block" : "hidden"
              }`}
            >
              <UsersTablePayouts searchParams={searchParams} />
            </div>
            <div
              className={`leading-relaxed ${
                openTab === "add" ? "block" : "hidden"
              }`}
            >
              <CreateUserForm />
            </div>
          </div>
        </Suspense>
      </SWRConfig>
    </div>
  );
};

export default UsersPageNavTabs;
