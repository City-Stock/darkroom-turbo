import { UpdateRoleConverter } from "@ess/firebase/src/converters/roles/UpdateRoleConverter";
import { auth, db } from "@/firebase/clientFirebaseInstance";
import { PermissionModel } from "@ess/zod/src/schemas/PermissionSchema";
import { RoleModel } from "@ess/zod/src/schemas/RoleSchema";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { type } from "os";
import { FC, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

type Props = {
  permission: PermissionModel;
  role: RoleModel;
};

const PermissionToggle: FC<Props> = ({ permission, role }) => {
  const [enabled, setEnabled] = useState(!!role.permissions.find((rolePerm) => rolePerm.permissionId.id === permission.uid));
  const [isSaving, setIsSaving] = useState(false);

  const onToggle = async () => {
    setIsSaving(true);

    if (enabled) {
      const removedPermissions = role.permissions.filter((rolePerm) => rolePerm.permissionId.id !== permission.uid);

      await updateDoc(doc(db, "roles", role.uid), {
        permissions: removedPermissions,
        modifedOn: serverTimestamp(),
        modifedBy: auth.currentUser?.uid,
      });

      setEnabled(false);
    } else {
      const permissionRef = doc(db, "permission", permission.uid);
      const updatedPermissions = [...role.permissions];

      updatedPermissions.push({ value: permission.value, permissionId: permissionRef, description: permission.description });

      await updateDoc(doc(db, "roles", role.uid), {
        permissions: updatedPermissions,
        modifedOn: serverTimestamp(),
        modifedBy: auth.currentUser?.uid,
      });

      setEnabled(true);
    }

    setIsSaving(false);
  };

  const checkMarkSvg = (
    <svg className="fill-white dark:fill-black" width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
        fill=""
        stroke=""
        strokeWidth="0.4"
      ></path>
    </svg>
  );

  const xSvg = (
    <svg className="h-4 w-4 stroke-current" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  );

  const loadingSpinner = <div className="w-6 h-6 rounded-full animate-spin border-y-2 border-solid border-blue-500 border-t-transparent shadow-md"></div>;

  return (
    <div className="flex gap-4 py-1 items-center">
      <label htmlFor={`${role.name}-${permission.uid}`} className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input type="checkbox" id={`${role.name}-${permission.uid}`} className="sr-only" onChange={() => onToggle()} />
          <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
          <div
            className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
              enabled && "!right-1 !translate-x-full !bg-primary dark:!bg-white"
            }`}
          >
            <span className={`hidden ${enabled && "!block"}`}>{isSaving ? loadingSpinner : checkMarkSvg}</span>
            <span className={`${enabled && "hidden"}`}>{isSaving ? loadingSpinner : xSvg}</span>
          </div>
        </div>
      </label>
      <div key={permission.value}>{permission.value}</div>
    </div>
  );
};

export default PermissionToggle;
