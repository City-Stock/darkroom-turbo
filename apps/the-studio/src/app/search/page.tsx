"use client";
import ResultsTable from "@/components/ResultsTable";
import SearchBar from "@/components/SearchBar";
import { db } from "@/firebase/clientFirebaseInstance";
import {
  FirestoreDataConverter,
  WithFieldValue,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  DocumentReference,
  collection,
  query,
  where,
} from "firebase/firestore";
import router from "next/router";
import { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";

type SearchContactsProps = {
  initialData: any[];
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

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  assignedStatus: boolean;
  assignedUserId: string | null;
  partnerOrganizationId: string;
};

const dummyUsers = [
  {
    id: "1d82cfba-1233-49a5-a9fc-27da7a495c63",
    firstName: "Dillon",
    lastName: "Lee",
    email: "dlee@essrocks.io",
    phone: "8308376140",
    assignedStatus: false,
    assignedUserId: null,
    partnerOrganizationId: "none",
  },
  // {
  //   id: '71qMtcOWzmVJbzAD0L14ocYpsFk1',
  //   firstName: 'Artem',
  //   lastName: 'Aleksandruk',
  //   email: 'aaleksandruk@essrocks.io',
  //   phone: '2252252222',
  //   assignedStatus: false,
  //   assignedUserId: null,
  //   partnerOrganizationId: 'none',
  // }
];

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

const SearchContacts: React.FC = () => {
  const allLeadsQuery = query(collection(db, "leads")).withConverter(leadConverter);
  const [allLeads, loading, error, snapshot] = useCollectionData(allLeadsQuery);

  // const handleSearch = async (query: string) => {
  //   // Implement API call logic here and set the results
  //   // For demonstration, let's mock the results
  //   const mockResults = [
  //     { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
  //     // ... add more mock results or fetch from an API
  //   ];

  //   setIsLoading(true);

  //   try {
  //       const response = await fetch(`https://rest.gohighlevel.com/v1/contacts/?query=${query}`, {
  //       headers: {
  //           'Authorization': `Bearer ${token}`
  //           }
  //       });

  //       const data = await response.json();
  //       setSearchResults(data.contacts)

  //   } catch (error) {
  //       console.error(error);
  //       // Optionally set some error state or show a user-friendly error message
  //   } finally {
  //       setIsLoading(false);  // Set loading to false at the end, regardless of success or error
  //   }
  // };

  return (
    <div className="h-full w-full p-4">
      <h1 className="w-full text-center text-3xl mb-6">Search For Users</h1>
      {/* <SearchBar onSearch={()=> console.log('search pressed')} /> */}
      <ResultsTable data={dummyUsers || []} loader={false} />
    </div>
  );
};

export default SearchContacts;
