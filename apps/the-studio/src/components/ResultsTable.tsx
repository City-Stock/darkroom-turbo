"use client";
import { db } from "@/firebase/clientFirebaseInstance";
import { DocumentData, DocumentReference, deleteDoc, doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface DataRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  assignedStatus: boolean;
  assignedUserId: string | null;
  partnerOrganizationId: string;
  ref: DocumentReference<DocumentData>;
}

type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  assignedStatus: boolean;
  assignedUserId: string | null;
  partnerOrganizationId: string;
};

type ResultsTableProps = {
  data: UserData[];
  loader: boolean;
};

const ResultsTable: React.FC<ResultsTableProps> = ({ data, loader }) => {
  console.log(data);

  const router = useRouter();
  const test = useParams();

  //TODO: AFTER ADMIN API ACCESS THIS WILL CHECK AGAINST AN API CALL
  const handleSubAccountMapping = (locationId: string) => {
    if (locationId === "L8KtFGacvThWy2R5SmKg") {
      return "ESS Sandbox";
    } else if (locationId === "qatAx2MFpGRuvILakq8w") {
      return "13Wks To Freedom";
    } else if (locationId === "qatAx2MFpGRuvILakq8w") {
      return "All Star Van Lines";
    } else if (locationId === "GyOB22koqxP2X1S3dzOn") {
      return "ess";
    } else if (locationId === "gC9yQxjaHkodx788WqO5") {
      return "Foodie Friends";
    } else {
      return locationId;
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    await deleteDoc(doc(db, "leads", contactId));
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Name</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Email</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Phone</h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Assigned</h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5"></div>
        </div>

        {data.map((contact, key) => (
          <div className={`grid grid-cols-3 sm:grid-cols-5 ${key === data.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"}`} key={key}>
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0">{/* <Image src={brand.logo} alt="Brand" width={48} height={48} /> */}</div>
              <p className="hidden text-black dark:text-white sm:block">{contact.firstName + " " + contact.lastName}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{contact.email}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p>{contact.phone}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">{contact.assignedStatus ? "Yes" : "No"}</p>
            </div>

            {/* <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p>{handleSubAccountMapping(contact.partnerOrganizationId)}</p>
            </div> */}

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <Link
                href={`/search/${contact.id}`}
                className="inline-flex border border-primary bg-primary py-1 px-2 font-medium text-white hover:border-primary hover:bg-primary hover:text-white dark:hover:border-primary sm:py-3 sm:px-6"
              >
                Details
              </Link>
              <button className="inline-flex border border-red bg-red py-1 px-2 font-medium text-white hover:border-red hover:bg-red hover:text-white dark:hover:border-red sm:py-3 sm:px-6">
                Trash
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsTable;
