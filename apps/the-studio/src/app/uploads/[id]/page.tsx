import EditUploadForm from "@/components/EditUploadForm";
import { Toaster } from "react-hot-toast";

const UploadPage = () => {
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
      <EditUploadForm />
    </>
  );
};

export default UploadPage;
