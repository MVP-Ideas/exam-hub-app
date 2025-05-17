"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { useGetCurrentUser } from "@/hooks";

export default function Page() {
  const { user, isLoading } = useGetCurrentUser();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      redirect("/login");
    } else if (user.role === "Admin") {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  }, [user, isLoading]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <BeatLoader size={48} />
    </div>
  );
}
