import { FC, use, useEffect, useState } from "react";
import editIcon from "@/assets/svgs/editIcon.svg";
import settingsIcon from "@/assets/svgs/settingsIcon.svg";
import Image from "next/image";
import Link from "next/link";
import { User } from "firebase/auth";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/clientFirebaseInstance";
import { useDocumentData } from "react-firebase-hooks/firestore";
import classNames from "classnames";

export interface UserWithClaims extends User {
  customClaims: { [x: string]: any };
}

type Props = {
  user: UserWithClaims;
};

const UserTableRowPayouts: FC<Props> = ({ user }) => {
  const [userData] = useDocumentData(doc(db, "user-sales-stats", user.uid));

  const handleClick = async () => {
    const ref = doc(db, "user-sales-stats", user.uid);

    const docSnapshot = await getDoc(ref);
    const currentPayoutTotal = docSnapshot?.data()?.payoutTotal || 0;
    const moneyToPay = docSnapshot?.data()?.currentPayoutTotal || 0;

    const newPayoutTotal = currentPayoutTotal + moneyToPay;

    await setDoc(
      ref,
      {
        payoutTotal: newPayoutTotal,
        currentPayoutTotal: 0,
      },
      { merge: true }
    );
  };

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
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        <p className="text-black dark:text-white">
          {userData?.currentPayoutTotal && userData?.currentPayoutTotal > 0
            ? "Pending Payout"
            : "Paid"}
        </p>
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        <p className="text-black dark:text-white">
          $
          {userData?.currentPayoutTotal
            ? userData?.currentPayoutTotal.toFixed(2)
            : "0.00"}
        </p>
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        <p className="text-black dark:text-white">
          ${userData?.payoutTotal ? userData?.payoutTotal.toFixed(2) : "0.00"}
        </p>
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        <div className="flex items-center justify-center space-x-3.5">
          {/* <Link href={`/users/${user.uid}`}> */}
          <button
            disabled={!userData?.currentPayoutTotal}
            onClick={handleClick}
            className={classNames(
              "bg-white hover:bg-gray-100 text-gray-100 font-semibold py-2 px-4 border border-primary-2 rounded shadow",
              {
                "border-none": !userData?.currentPayoutTotal,
              }
            )}
          >
            Pay
          </button>
          {/* </Link> */}
        </div>
      </td>
    </tr>
  );
};

export default UserTableRowPayouts;
