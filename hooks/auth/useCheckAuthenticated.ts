"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useGetCurrentUser from "../users/useGetCurrentUser";

export default function useCheckAuthenticated() {
  const { user, isLoading } = useGetCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading || pathname === "/logout") return;

    if (user) {
      if (user.role === "Admin") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [user, router, isLoading, pathname]);
}
