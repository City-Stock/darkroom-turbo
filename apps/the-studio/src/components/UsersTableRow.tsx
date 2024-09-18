import { FC } from "react";
import editIcon from "@/assets/svgs/editIcon.svg";
import settingsIcon from "@/assets/svgs/settingsIcon.svg";
import Image from "next/image";
import Link from "next/link";
import { User } from "firebase/auth";

export interface UserWithClaims extends User {
  customClaims: { [x: string]: any };
}

type Props = {
  user: UserWithClaims;
};

const UserTableRow: FC<Props> = ({ user }) => {
  return (
    <tr>
      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
        <h5 className="font-medium text-black dark:text-white">
          {user?.displayName ?? ""}
        </h5>
        {/* <p className="text-sm">${packageItem.price}</p> */}
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        <p className="text-black dark:text-white">{user?.email ?? ""}</p>
      </td>
      {/* <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        <p className="text-black dark:text-white">{user.customClaims?.userMetadata?.partnerOrganizationName}</p>
      </td> */}
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        <p className="text-black dark:text-white">
          {user?.customClaims?.userMetadata?.roleName ?? ""}
        </p>
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        <div className="flex items-center justify-center space-x-3.5">
          <Link href={`/users/${user.uid}`}>
            <button className="hover:text-primary">
              <Image src={settingsIcon} alt="" width={18} height={18} />
            </button>
          </Link>
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;
