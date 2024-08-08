import PermissionsContainer from "@/components/PermissionsContainer";
import RolesContainer from "@/components/RolesContainer";
import Image from "next/image";
import { Toaster } from "react-hot-toast";

const Settings = () => {
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
              width: 300,
              fontSize: 20,
              height: 65,
            },
          },
        }}
      />
      <div className="mx-auto max-w-270">
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <RolesContainer />
          </div>
          <div className="col-span-5 xl:col-span-2">
            <PermissionsContainer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
