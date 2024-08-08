"use client";
import {
  collection,
  where,
  query,
  FirestoreDataConverter,
  WithFieldValue,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  DocumentReference,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";

import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ResultsTable from "@/components/ResultsTable";
import AssignedTable from "@/components/AssignedTable";
import UnassignedTable from "@/components/UnassignedTable";
import { AuthContext } from "@/context/AuthContext";
import { createDtoSchema } from "@ess/zod/src/schemas/CreateDtoSchema";
import { UserSchema } from "@ess/zod/src/schemas/UserSchema";
import { getApiBaseUrl } from "@ess/utils";
import { db } from "@/firebase/clientFirebaseInstance";
import { Toaster } from "react-hot-toast";

type ActiveUserModel = {
  displayName: string;
  phoneNumber: string;
  email: string;
  partnerOrganizationId: string;
  roleId: string;
};

type ContactDetailProps = {
  contact: {
    id: string;
    locationId: string;
    fullNameLowerCase: string;
    firstNameLowerCase: string;
    lastNameLowerCase: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    type: string;
    dateAdded: string;
    tags: string[];
    customField: any[];
    attributionSource: {
      sessionSource: string;
      mediumId: string | null;
      medium: string;
    };
    lastAttributionSource: any;
  };
  assignedContacts: {
    name: string;
    id: string;
    number: string;
    email: string;
    assignedCustomer: string;
  }[];
  unassignedContacts: {
    name: string;
    id: string;
    number: string;
    email: string;
    assignedCustomer: string;
  }[];
};

type Contact = {
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
};

const leadConverter: FirestoreDataConverter<Contact> = {
  toFirestore(contact: WithFieldValue<Contact>): DocumentData {
    return { firstName: contact.firstName };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Contact {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ref: snapshot.ref,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      partnerOrganizationId: data.partnerOrganizationId,
      originLocation: data.originLocation,
      assignedStatus: data.assignedStatus,
      assignedUserId: data.assignedUserId,
    };
  },
};

const ContactDetails: React.FC = () => {
  const { id } = useParams();
  const { currentUserIdToken } = useContext(AuthContext);

  const [activeContact, setActiveContact] = useState<ActiveUserModel>({
    displayName: "",
    phoneNumber: "",
    email: "",
    partnerOrganizationId: "",
    roleId: "",
  });

  console.log(id.toString().toLocaleLowerCase());

  const assignedQuery = query(
    collection(db, "leads"),
    where("assignedStatus", "==", true),
    where("assignedUserId", "==", id.toString().toLocaleLowerCase()),
    where("originLocation", "==", "goHighLevel")
  ).withConverter(leadConverter);
  const [
    assignedContacts,
    assignedLeadsLoading,
    assignedLeadsError,
    assignedLeadsSnapshot,
  ] = useCollectionData(assignedQuery);

  const unassignedQuery = query(
    collection(db, "leads"),
    where("assignedStatus", "==", false),
    where("__name__", "!=", id)
  ).withConverter(leadConverter);
  const [
    unassignedContacts,
    unassignedLeadsLoading,
    unassignedLeadsError,
    unassignedLeadsSnapshot,
  ] = useCollectionData(unassignedQuery);

  useEffect(() => {
    const getActiveUserData = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/users/${id}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${currentUserIdToken}`,
          },
        });

        const data = await response.json();
        const validateDTO = createDtoSchema(UserSchema).safeParse(data);

        if (!validateDTO.success) throw new Error(validateDTO.error.toString());
        if (!response.ok && validateDTO.data.errors)
          throw new Error(validateDTO.data.errors[0].message);
        if (!validateDTO.data.data.length) throw new Error("User not found");

        const { displayName, phoneNumber, email, customClaims } =
          validateDTO.data.data[0];

        setActiveContact({
          displayName,
          phoneNumber,
          email,
          partnerOrganizationId:
            customClaims.userMetadata.partnerOrganizationId,
          roleId: customClaims.userMetadata.roleId,
        });
      } catch (error) {
        console.log(error);
      }
    };
    getActiveUserData();
  }, []);

  // You can use router.isFallback for skeleton loading if needed
  if (!id || assignedLeadsLoading || unassignedLeadsLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },

          // Default options for specific types
          success: {
            style: {
              width: 300,
              height: 65,

              fontSize: 20,
            },
            duration: 3000,
            iconTheme: {
              primary: "green",
              secondary: "black",
            },
          },
          error: {
            style: {
              width: 300,
              height: 65,

              fontSize: 20,
            },
            duration: 3000,
            iconTheme: {
              primary: "red",
              secondary: "black",
            },
          },
          loading: {
            duration: 3000,
            style: {
              height: 65,
              width: 300,
              fontSize: 20,
            },
          },
        }}
      />
      <div className="flex h-screen">
        {/* Left Side */}
        <div className="w-1/5 p-4 bg-gray-100 text-lg">
          <h2 className="text-2xl mb-4">User Details</h2>

          <div className="mb-4">
            <div className="text-base font-bold mb-1">Full Name:</div>
            <div>{activeContact.displayName}</div>
          </div>

          <div className="mb-4">
            <div className="text-base font-bold mb-1">Email:</div>
            <div>{activeContact.email}</div>
          </div>

          <div className="mb-4">
            <div className="text-base font-bold mb-1">Phone:</div>
            <div>{activeContact.phoneNumber}</div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-4/5 p-4 flex flex-col">
          {/* Top Half */}
          <div className="flex-1 mb-4 p-4 rounded">
            <h2 className="text-4xl mb-4">Assigned Leads</h2>
            <AssignedTable data={assignedContacts || []} />
          </div>

          {/* Bottom Half */}
          <div className="flex-1  p-4 rounded">
            <h2 className="text-4xl mb-4">Unassigned Leads</h2>
            <UnassignedTable data={unassignedContacts || []} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactDetails;
