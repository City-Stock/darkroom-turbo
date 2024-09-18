import { FC, use, useEffect, useState } from "react";
import QueryFilter from "./QueryFilter";
import UserTableRow from "./UsersTableRow";
import { getAuth } from "firebase/auth";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { set } from "zod";
import { db } from "@/firebase/clientFirebaseInstance";
import { useCollectionData } from "react-firebase-hooks/firestore";
import UserTableRowPayouts from "./UsersTableRowPayouts";

type Props = {
  searchParams?: { [key: string]: string | undefined };
};

const getUsers = async (
  searchParams: { [key: string]: string | undefined } | undefined
) => {
  const emailQuery = searchParams?.emailAddress
    ? `emailAddress=${searchParams.emailAddress}`
    : "";
  const nameQuery = searchParams?.displayName
    ? `displayName=${searchParams.displayName}`
    : "";
  const phoneNumberQuery = searchParams?.phone
    ? `phone=${searchParams.phone}`
    : "";
  try {
    const usersRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users?${
        emailQuery + nameQuery + phoneNumberQuery
      }`,
      {
        next:
          !emailQuery && !nameQuery && !phoneNumberQuery
            ? { revalidate: 60 }
            : undefined,
        cache:
          emailQuery || nameQuery || phoneNumberQuery ? "no-cache" : undefined,
      }
    );

    if (!usersRes.ok) {
      return {
        data: [],
        error: usersRes.status,
        page: 0,
      };
    }

    return (await usersRes.json()) as {
      data: any[];
      page: number;
      error?: string;
    };
  } catch (error) {
    console.log();
    return {
      data: [],
      error: error.messsage,
      page: 0,
    };
  }
};

const UsersTablePayouts: FC<Props> = ({ searchParams }) => {
  const ref = collection(db, "user-sales-stats");

  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const fetchUserEffect = async () => {
      const users = await getUsers(searchParams);

      setState(users);
    };
    fetchUserEffect();
  }, [searchParams]);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <div className="mb-4 grid grid-cols-4 gap-6 ">
          <QueryFilter label="Display Name" queryName="displayName" />
          <QueryFilter label="Email" queryName="emailAddress" />
          <QueryFilter label="Phone" queryName="phone" />
        </div>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Display Name
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Email
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Phone Number
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Amount Owed
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Total Payouts
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {state?.data.map((user, key) => (
              <UserTableRowPayouts user={user} key={key} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTablePayouts;
