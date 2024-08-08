"use client";

import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { db } from "@/firebase/clientFirebaseInstance";
import { RoleConverter } from "@ess/firebase/src/converters/roles/RoleConverter";
import RoleItem from "./RoleItem";
import { useState } from "react";
import CreateRoleModal from "./CreateRoleModal";

const RolesContainer = () => {
  const [roles, isLoading, errors, snapshot] = useCollectionData(collection(db, "roles").withConverter(RoleConverter));
  const [active, setActive] = useState("");

  return (
    <div className="rounded-sm flex flex-col gap-4">
      <div className="border border-stroke py-4 px-7 dark:border-strokedark flex justify-between items-center bg-white dark:bg-boxdark shadow-sm ">
        <h3 className="font-medium text-black dark:text-white">Roles</h3>
        <CreateRoleModal />
      </div>
      {roles?.map((role) => (
        <RoleItem key={role.uid} role={role} active={active} handleToggle={setActive} />
      ))}
    </div>
  );
};

export default RolesContainer;
