import { auth } from "@/firebase/clientFirebaseInstance";
import { IdTokenResult, User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, FC, ReactNode, SetStateAction, createContext, useCallback, useEffect, useState } from "react";

type UserMetadata = {
  partnerOrganizationId: string;
  partnerOrganizationName: string;
  roleId: string;
  roleName: string;
};

type UserPermissions = {
  [permission: string]: boolean;
};

type AuthContextProps = {
  currentUser: User | null;
  currentUserIdToken: string | null;
  permissions: UserPermissions | null;
  userMetadata: UserMetadata | null;
  isUserReady: boolean;
  isUserLoading: boolean;
  setIsUserLoading: Dispatch<SetStateAction<boolean>>;
};

export const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  currentUserIdToken: null,
  permissions: null,
  userMetadata: null,
  isUserReady: false,
  isUserLoading: true,
  setIsUserLoading: () => {},
});

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserDecodedToken, setCurrentUserDecodedToken] = useState<IdTokenResult | null>(null);
  const [currentUserIdToken, setCurrentUserIdToken] = useState<string | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  // Handle user state changes
  const onAuthStateChanged = useCallback(
    async (user: User | null) => {
      if (user) {
        const userIdToken = await user.getIdToken(true);
        setCurrentUserIdToken(userIdToken);

        const userDecodedToken = await user.getIdTokenResult();
        setCurrentUserDecodedToken(userDecodedToken);
        if (pathname === "/signin") router.replace("/");
      } else {
        if (pathname !== "/signin") router.replace("/signin");
        setCurrentUserIdToken(null);
        setCurrentUserDecodedToken(null);
      }

      setCurrentUser(user);
      setIsUserLoading(false);
    },
    [pathname, router]
  );

  const userInfo = {
    permissions: currentUserDecodedToken?.claims.permissions as UserPermissions | null,
    userMetadata: currentUserDecodedToken?.claims.userMetadata as UserMetadata | null,
    isUserReady: !!currentUser && !isUserLoading && !!currentUserDecodedToken,
    currentUserIdToken,
    isUserLoading,
  };

  useEffect(() => {
    // if (!currentUser && !isUserLoading) router.replace("/signin");
    // if (currentUser && currentUserDecodedToken && pathname === "/signin") router.replace("/");
  }, [currentUser, currentUserDecodedToken, isUserLoading, pathname, router]);

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [onAuthStateChanged]);

  return <AuthContext.Provider value={{ currentUser, ...userInfo, setIsUserLoading }}>{children}</AuthContext.Provider>;
};
