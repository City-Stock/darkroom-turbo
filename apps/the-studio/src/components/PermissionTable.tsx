import { PermissionConverter } from "@ess/firebase/src/converters/permissions/PermissionConverter";
import { db } from "@/firebase/clientFirebaseInstance";
import { collection, deleteDoc, doc, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import PermissionTableRow from "./PermissionTableRow";

const PermissionTable = () => {
  const [permissions, isLoading, errors] = useCollectionData(collection(db, "permissions").withConverter(PermissionConverter));
  console.log(errors);
  console.log(permissions);

  return (
    <div className="rounded-sm bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4 text-sm">
              <th className="py-4 px-7 font-medium text-black dark:text-white ">Value & Description</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {permissions?.map((permission, key) => (
              <PermissionTableRow key={permission.uid} value={permission.value} description={permission.description} uid={permission.uid} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionTable;
