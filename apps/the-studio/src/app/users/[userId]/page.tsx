import EditUserForm from "@/components/Forms/EditUserForm";
import UsersPageNavTabs from "@/components/UsersPageNavTabs";
import { auth } from "@/firebase/clientFirebaseInstance";
import { Metadata } from "next";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Mr. Leads Needs | Users",
  description: "Mr. Leads Needs | Users",
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  console.log(searchParams);
  const userToken = await auth.currentUser?.getIdTokenResult();

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
      <EditUserForm />
    </>
  );
}
