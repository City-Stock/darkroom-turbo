"use client";
import React from "react";
import DataStatsThree from "../DataStats/DataStatsThree";
import ChartSeven from "../Charts/ChartSeven";
import ChartEight from "../Charts/ChartEight";
import ChartNine from "../Charts/ChartNine";
import LeadsReport from "../LeadsReport";
import ToDoList from "../Todo/ToDoList";
import { db } from "@/firebase/clientFirebaseInstance";
import {
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  collection,
  query,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  assignedStatus: boolean;
  assignedUserId: string | null;
  partnerOrganizationId: string;
  ref: DocumentReference<DocumentData>;
};

const leadConverter: FirestoreDataConverter<Contact> = {
  toFirestore(contact: WithFieldValue<Contact>): DocumentData {
    return { firstName: contact.firstName };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Contact {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ref: snapshot.ref,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      partnerOrganizationId: data.partnerOrganizationId,
      assignedStatus: data.assignedStatus,
      assignedUserId: data.assignedUserId,
    };
  },
};

const CRM: React.FC = () => {
  const allLeadsQuery = query(collection(db, "leads")).withConverter(leadConverter);
  const [allLeads, loading, error, snapshot] = useCollectionData(allLeadsQuery);
  return (
    <>
      <DataStatsThree totalContacts={allLeads?.length || 0} />

      <div className="mt-7.5 grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-7">
          <ChartSeven />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <ChartEight />
        </div>

        <LeadsReport />

        <div className="col-span-12 xl:col-span-5">
          <ChartNine />
        </div>

        <ToDoList />
      </div>
    </>
  );
};

export default CRM;
