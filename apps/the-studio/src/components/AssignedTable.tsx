"use client";
import {
  DocumentData,
  DocumentReference,
  doc,
  setDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import QueryFilter from "./QueryFilter";
import { db } from "@/firebase/clientFirebaseInstance";
import toast from "react-hot-toast";

interface DataRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  assignedStatus: boolean;
  assignedUserId: string | null;
  partnerOrganizationId: string;
  originLocation: string;
  ref: DocumentReference<DocumentData>;
}

type ResultsTableProps = {
  data: DataRow[];
  loader: boolean;
};

type Props = {
  searchParams?: { [key: string]: string | undefined };
  data: DataRow[];
};

const tokenEss = process.env.NEXT_PUBLIC_HIGHLEVEL_ESS_SUB_ACCOUNT_TOKEN;

const AssignedTable: FC<Props> = ({ searchParams, data }) => {
  const emailQuery = searchParams?.email ? `email=${searchParams.email}` : "";
  const nameQuery = searchParams?.displayName
    ? `displayName=${searchParams.displayName}`
    : "";
  const phoneNumberQuery = searchParams?.phoneNumber
    ? `phoneNumber=${searchParams.phoneNumber}`
    : "";
  const partnerOrganizationNameQuery = searchParams?.partnerOrganizationName
    ? `partnerOrganizationName=${searchParams.partnerOrganizationName}`
    : "";

  const { id } = useParams();

  const [assignLoader, setAssignLoader] = useState(false);

  const handleAssignment = async (assignedContact: DataRow) => {
    const dataToSend = {
      tags: [`assignedto: ${id.toString().toLocaleLowerCase()}`],
    };

    await fetch(
      `https://rest.gohighlevel.com/v1/contacts/${assignedContact.id}/tags/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenEss}`,
        },
        body: JSON.stringify(dataToSend),
      }
    );

    const docData = {
      firstName: assignedContact.firstName,
      lastName: assignedContact.lastName,
      email: assignedContact.email,
      phone: assignedContact.phone,
      partnerOrganizationId: assignedContact.partnerOrganizationId,
      assignedStatus: false,
      assignedUserId: null,
      originLocation: assignedContact.originLocation,
    };

    await setDoc(doc(db, "leads", assignedContact.id), docData);
  };

  const handleAssignContact = async (toggledContact: DataRow) => {
    try {
      await toast.promise(handleAssignment(toggledContact), {
        loading: "Unassigning Contact...",
        success: () => {
          return <div>{`Contact unassigned`}</div>;
        },
        error: ({ message }) => {
          return <div>{message}</div>;
        },
      });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <div className="mb-4 grid grid-cols-4 gap-6 ">
          <QueryFilter label="First Name" queryName="firstName" />
          <QueryFilter label="Email" queryName="email" />
          <QueryFilter label="Phone" queryName="phone" />
        </div>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                First
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Email
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Phone
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((lead, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {lead.firstName + " " + lead.lastName}
                  </h5>
                  {/* <p className="text-sm">${packageItem.price}</p> */}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{lead.email}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{lead.phone}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center justify-center space-x-3.5">
                    <button
                      className="hover:text-primary"
                      onClick={() => handleAssignContact(lead)}
                    >
                      unadd
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// const AssignedTable: React.FC<ResultsTableProps> = ({ data, loader }) => {

//   const router = useRouter();
//   const { id } = useParams();

//   const [assignLoader, setAssignLoader] = useState(false);

//   const handleAssignment = async (assignedContact: DataRow) => {

//     const dataToSend = {
//       tags: [
//         `assignedto: ${id.toString().toLocaleLowerCase()}`
//       ]
//     }

//     await fetch(`https://rest.gohighlevel.com/v1/contacts/${assignedContact.id}/tags/`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${tokenEss}`
//       },
//       body: JSON.stringify(dataToSend)
//     });

//     const docData = {
//       firstName: assignedContact.firstName,
//       lastName: assignedContact.lastName,
//       email: assignedContact.email,
//       phone: assignedContact.phone,
//       partnerOrganizationId: assignedContact.partnerOrganizationId,
//       assignedStatus: false,
//       assignedUserId: null,
//     }

//     await setDoc(doc(db, "leads", assignedContact.id), docData);
//   }

//   const handleAssignContact = (toggledContact: DataRow) => {
//     setAssignLoader(true);
//     handleAssignment(toggledContact).then(()=>{
//       alert('succesfully removed contact')
//       setAssignLoader(false);
//     })
//   }

//   return (
//     <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
//       <div className="flex flex-col">
//         <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
//           <div className="p-2.5 xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">Name</h5>
//           </div>
//           <div className="p-2.5 text-center xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">Email</h5>
//           </div>
//           <div className="p-2.5 text-center xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">Phone</h5>
//           </div>
//           <div className="hidden p-2.5 text-center sm:block xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">Assigned</h5>
//           </div>
//           <div className="hidden p-2.5 text-center sm:block xl:p-5">

//           </div>
//         </div>

//         {data.map((contact, key) => (
//           <div className={`grid grid-cols-3 sm:grid-cols-5 ${key === data.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"}`} key={key}>
//             <div className="flex items-center gap-3 p-2.5 xl:p-5">
//               <div className="flex-shrink-0">
//                 {/* <Image src={brand.logo} alt="Brand" width={48} height={48} /> */}
//               </div>
//               <p className="hidden text-black dark:text-white sm:block">{contact.firstName + " " + contact.lastName}</p>
//             </div>

//             <div className="flex items-center justify-center p-2.5 xl:p-5">
//               <p className="text-black dark:text-white">{contact.email}</p>
//             </div>

//             <div className="flex items-center justify-center p-2.5 xl:p-5">
//               <p>{contact.phone}</p>
//             </div>

//             <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
//               <p className="text-black dark:text-white">{contact.assignedStatus ? 'Yes' : 'No'}</p>
//             </div>

//             <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
//                 <button
//                   onClick={()=>handleAssignContact(contact)}
//                   className="inline-flex border border-red bg-red py-1 px-2 font-medium text-white hover:border-red hover:bg-red hover:text-white dark:hover:border-red sm:py-3 sm:px-6"
//                 >
//                   REMOVE
//                 </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

export default AssignedTable;
