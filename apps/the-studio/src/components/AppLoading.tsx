import { AuthContext } from "@/context/AuthContext";
import { FC, ReactNode, useContext } from "react";

const AppLoading: FC<{ children: any }> = ({ children }) => {
  const { isUserLoading } = useContext(AuthContext);
  return isUserLoading ? (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  ) : (
    children
  );
};

export default AppLoading;
