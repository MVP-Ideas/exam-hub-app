import { useState, useCallback } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginScopes } from "@/config/auth-config";
import { useAuthStore } from "@/lib/stores/auth-store";
import { UserB2CLoginRegister, UserLocalLogin } from "@/lib/types/auth";
import { toast } from "sonner";
import useSignUpOrLoginUserB2C from "./useSignUpOrLoginUserB2C";
import useLoginUser from "./useLoginUser";
import { usePathname, useRouter } from "next/navigation";
import useGetCurrentUser from "../users/useGetCurrentUser";
import useLogoutUser from "./useLogoutUser";

const useAuth = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { instance } = useMsal();
  const isAuthenticatedB2C = useIsAuthenticated();
  const { logout } = useAuthStore();
  const { signUpOrLoginB2C } = useSignUpOrLoginUserB2C();
  const { loginUser } = useLoginUser();
  const {
    user: currentUser,
    isLoading: isLoadingCurrentUser,
    isFetched,
    isError,
  } = useGetCurrentUser();
  const { logoutUser } = useLogoutUser();
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!currentUser;

  const handleLogout = useCallback(() => {
    setIsLoading(true);
    if (isAuthenticatedB2C) {
      instance.logoutPopup();
      instance.clearCache();
    }
    logout();
    logoutUser();
    if (pathName !== "/login" && pathName !== "/sign-up") {
      router.push("/login");
    }

    setIsLoading(false);
  }, [instance, isAuthenticatedB2C, logout, logoutUser, pathName, router]);

  const handleLoginLocal = async (user: UserLocalLogin) => {
    setIsLoading(true);
    try {
      await loginUser(user);
      toast.success("Login successful");

      if (currentUser?.role.toLowerCase() === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Login error", error);
      toast.error("Login failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginB2C = async (provider: string | null) => {
    setIsLoading(true);
    try {
      const loginResult = await instance.loginPopup({
        scopes: loginScopes,
        domainHint: `${provider}.com`,
      });

      if (!loginResult.account) throw new Error("No account");

      const tokenResponse = await instance.acquireTokenSilent({
        scopes: loginScopes,
        account: loginResult.account,
      });

      const userDto: UserB2CLoginRegister = {
        email: tokenResponse.account.username,
        name: tokenResponse.account.name ?? "unknown",
        b2cUserId: tokenResponse.uniqueId,
        accountType: loginResult.account.idTokenClaims?.idp ?? "B2C",
      };

      await signUpOrLoginB2C({
        request: userDto,
        accessToken: tokenResponse.accessToken,
      });
      toast.success("Login successful");

      if (currentUser?.role.toLowerCase() === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      handleLogout();
      toast.error("Login failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    isLoadingCurrentUser,
    isFetched,
    isError,
    handleLoginB2C,
    handleLoginLocal,
    handleLogout,
  };
};

export default useAuth;
