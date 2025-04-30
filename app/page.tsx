"use client";

import { useUserStore } from "@/components/providers/user-store-provider";
import { UserState } from "@/lib/stores/user-store";
import { redirect } from "next/navigation";

export default function Page() {
  const { user } = useUserStore((state: UserState) => ({
    user: state.user,
  }));

  if (!user) {
    redirect("/login");
  }
  if (user?.role === "Admin") {
    redirect("/admin");
  } else {
    redirect("/dashboard");
  }
}
