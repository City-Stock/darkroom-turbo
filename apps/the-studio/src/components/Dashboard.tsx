"use client";
import { auth, db } from "@/firebase/clientFirebaseInstance";
import {
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  collection,
  doc,
  query,
} from "firebase/firestore";
import React, { Suspense, useEffect, useState } from "react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import DataStats from "./DataStats";
import useSWR, { SWRConfig } from "swr";
import { Auth } from "firebase-admin/lib/auth/auth";

type MetaData = {
  total: number;
  nextPageUrl: string;
  startAfterId: string;
  startAfter: number;
  currentPage: number;
  nextPage: string | null;
  prevPage: string | null;
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
      assignedStatus: data.assignedStatus,
      assignedUserId: data.assignedUserId,
    };
  },
};

const Dashboard: React.FC = () => {
  const allLeadsQuery = query(collection(db, "leads")).withConverter(
    leadConverter
  );
  const { currentUser } = auth;
  const [allLeads, loading, error, snapshot] = useCollectionData(allLeadsQuery);

  const userRef = doc(db, "user-sales-stats", currentUser?.uid as string);
  const [test, loadingTest] = useDocumentData(userRef);

  if (loadingTest || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
        <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <SWRConfig value={{ suspense: true }}>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          </div>
        }
      >
        <DataStats
          userSalesStats={test}
          totalContacts={allLeads?.length || 0}
        />
      </Suspense>
    </SWRConfig>
  );
};

export default Dashboard;
