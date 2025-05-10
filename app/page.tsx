"use client";

import { useEffect } from "react";
import { useUserStore } from "@/components/providers/user-store-provider";
import { UserState } from "@/lib/stores/user-store";
import { redirect } from "next/navigation";
import { BeatLoader } from "react-spinners";

export default function Page() {
  const { user } = useUserStore((state: UserState) => ({
    user: state.user,
  }));

  useEffect(() => {
    if (!user) {
      redirect("/login");
    } else if (user.role === "Admin") {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  }, [user]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <BeatLoader size={48} />
    </div>
  );
}
