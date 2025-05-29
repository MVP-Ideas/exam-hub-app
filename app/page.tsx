"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserState, useUserStore } from "@/lib/stores/user-store";
import AppLoader from "@/components/common/app-loader";

export default function Page() {
  const router = useRouter();
  const { user } = useUserStore((state: UserState) => ({
    user: state.user,
  }));

  useEffect(() => {
    if (user) {
      if (user.role === "Admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } else {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <AppLoader />
    </div>
  );
}
