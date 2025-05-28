"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/lib/stores/user-store";

export default function useCheckAuthenticated() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/logout") return;

    if (user) {
      if (user.role === "Admin") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [user, router, pathname]);
}
