import { FC } from "react";
import QueryFilter from "./QueryFilter";
import UserTableRow from "./UsersTableRow";

type Props = {
  searchParams?: { [key: string]: string | undefined };
};

const getUsers = async (
  searchParams: { [key: string]: string | undefined } | undefined
) => {
  const emailQuery = searchParams?.email ? `email=${searchParams.email}` : "";
  const nameQuery = searchParams?.displayName
    ? `displayName=${searchParams.displayName}`
    : "";
  const phoneNumberQuery = searchParams?.phoneNumber
    ? `phoneNumber=${searchParams.phoneNumber}`
    : "";
  // const partnerOrganizationNameQuery = searchParams?.partnerOrganizationName
  //   ? `partnerOrganizationName=${searchParams.partnerOrganizationName}`
  //   : "";

  try {
    const usersRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users?${
        emailQuery +
        nameQuery +
        // partnerOrganizationNameQuery +
        phoneNumberQuery
      }`,
      {
        next:
          !emailQuery &&
          !nameQuery &&
          // !partnerOrganizationNameQuery &&
          !phoneNumberQuery
            ? { revalidate: 60 }
            : undefined,
        cache:
          emailQuery ||
          nameQuery ||
          // partnerOrganizationNameQuery ||
          phoneNumberQuery
            ? "no-cache"
            : undefined,
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

const UsersTable: FC<Props> = async ({ searchParams }) => {
  // const emailQuery = searchParams?.email ? `email=${searchParams.email}` : "";
  // const nameQuery = searchParams?.displayName ? `displayName=${searchParams.displayName}` : "";
  // const phoneNumberQuery = searchParams?.phoneNumber ? `phoneNumber=${searchParams.phoneNumber}` : "";
  // const partnerOrganizationNameQuery = searchParams?.partnerOrganizationName ? `partnerOrganizationName=${searchParams.partnerOrganizationName}` : "";

  const usersDTO = await getUsers(searchParams);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <div className="mb-4 grid grid-cols-4 gap-6 ">
          <QueryFilter label="Display Name" queryName="displayName" />
          <QueryFilter label="Email" queryName="email" />
          <QueryFilter label="Phone" queryName="phone" />
          {/* <QueryFilter
            label="Partner Org Name"
            queryName="partnerOrganizationName"
          /> */}
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
                Phone
              </th>
              {/* <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Partner Org Name
              </th> */}
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Role
              </th>
              {/* <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th> */}
              <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {usersDTO?.data.map((user, key) => (
              <UserTableRow user={user} key={key} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
