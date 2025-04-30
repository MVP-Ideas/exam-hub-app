"use client";

import { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { useRouter } from "next/navigation";
import UserService from "@/lib/services/user-service";
import AuthService from "@/lib/services/auth-service";
import { UserLocalLogin, UserB2CLoginRegister } from "@/lib/types/auth";
import { toast } from "sonner";
import { loginScopes } from "@/config/auth-config";
import { extractAxiosErrorMessage } from "@/lib/utils";
import { useUserStore } from "@/components/providers/user-store-provider";
import { UserState } from "@/lib/stores/user-store";

export default function useAuth() {
  const { instance, inProgress } = useMsal();
  const router = useRouter();
  const { setUser, clearUser, lastUpdated } = useUserStore(
    (state: UserState) => ({
      setUser: state.setUser,
      clearUser: state.clearUser,
      lastUpdated: state.lastUpdated,
    }),
  );
  const [isLoading, setIsLoading] = useState(false);

  const verifyToken = async () => {
    // Check if last updated is null or five minutes older
    if (
      lastUpdated &&
      new Date().getTime() - new Date(lastUpdated).getTime() < 5 * 60 * 1000
    ) {
      return true;
    }

    setIsLoading(true);

    try {
      const user = await UserService.getCurrentUser();

      if (!user) throw new Error("No user returned");

      setUser(user);

      return true;
    } catch (error) {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
      await instance.logoutRedirect({
        postLogoutRedirectUri: "/login",
      });
      clearUser();
      router.push("/login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginLocal = async (credentials: UserLocalLogin) => {
    setIsLoading(true);
    try {
      await AuthService.localLogin(credentials);

      const user = await UserService.getCurrentUser();
      if (user) {
        setUser(user);
        toast.success("Login successful!");

        if (user.role.toLowerCase() === "admin") {
          router.replace("/admin");
        } else {
          router.replace("/");
        }
      } else {
        throw new Error("Login succeeded but no user returned");
      }
    } catch (error) {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginB2C = async (provider: string) => {
    setIsLoading(true);
    try {
      const res = await instance.loginPopup({
        scopes: loginScopes,
        domainHint: provider ? `${provider}.com` : undefined,
      });

      if (!res.account) throw new Error("No account returned");

      const tokenRes = await instance.acquireTokenSilent({
        scopes: loginScopes,
        account: res.account,
      });

      const userDto: UserB2CLoginRegister = {
        email: tokenRes.account.username,
        name: tokenRes.account.name || "unknown",
        b2cUserId: tokenRes.uniqueId,
        accountType: res.account.idTokenClaims?.idp || "B2C",
      };

      await AuthService.b2cLoginRegister(userDto, tokenRes.accessToken);

      const user = await UserService.getCurrentUser();
      if (user) {
        setUser(user);
        toast.success("Login successful!");

        if (user.role.toLowerCase() === "admin") {
          router.replace("/admin");
        } else {
          router.replace("/");
        }
      } else {
        throw new Error("B2C login succeeded but no user returned");
      }
    } catch (error) {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await instance.logoutRedirect({
        postLogoutRedirectUri: "/login",
      });
      clearUser();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading: isLoading || inProgress !== "none",
    verifyToken,
    handleLoginLocal,
    handleLoginB2C,
    handleLogout,
  };
}
