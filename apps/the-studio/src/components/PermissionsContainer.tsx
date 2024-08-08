"use client";

import PermissionTable from "./PermissionTable";
import CreatePermissionModal from "./CreatePermissionModal";

const PermissionsContainer = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-7 dark:border-strokedark flex justify-between items-center">
        <h3 className="font-medium text-black dark:text-white">Permissions</h3>
        <CreatePermissionModal />
      </div>
      <PermissionTable />
    </div>
  );
};

export default PermissionsContainer;
