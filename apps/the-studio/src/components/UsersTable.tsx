import { FC } from "react";
import QueryFilter from "./QueryFilter";
import UserTableRow from "./UsersTableRow";
import { getAuth } from "firebase/auth";
import { app, db } from "@/firebase/clientFirebaseInstance";
import { collection, getDocs } from "firebase/firestore";

type Props = {
  searchParams?: { [key: string]: string | undefined };
};

const fetchUsers = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/getUsers`);
    if (!res.ok) {
      return [];
    }
    const users = await res.json();
    return users;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const UsersTable: FC<Props> = async ({ searchParams }) => {
  const usersDTO = await fetchUsers();

  const filteredUsers = usersDTO.filter((user) => {
    const matchesDisplayName = searchParams?.displayName
      ? user?.displayName
          ?.toLowerCase()
          ?.includes(searchParams?.displayName?.toLowerCase())
      : true;
    const matchesEmail = searchParams?.email
      ? user.email.toLowerCase().includes(searchParams.email.toLowerCase())
      : true;

    return matchesEmail && matchesDisplayName;
  });

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <div className="mb-4 grid grid-cols-4 gap-6 ">
          <QueryFilter label="Display Name" queryName="displayName" />
          <QueryFilter label="Email" queryName="email" />
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
                Role
              </th>

              <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers?.map((user, key) => (
              <UserTableRow user={user} key={key} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
