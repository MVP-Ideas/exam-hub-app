"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { BeatLoader } from "react-spinners";

export default function AdminProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathName = usePathname();
  const { user } = useAuthStore();

  useEffect(() => {
    // If user exists and is not admin, redirect
    if (user && user.role?.toLowerCase() !== "admin") {
      console.log(user.role);
      console.log("Not an admin, redirecting to home");
      router.replace("/");
    }
  }, [user, pathName, router]);

  if (!user) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <BeatLoader size={20} />
      </div>
    );
  }

  if (user?.role !== "Admin") {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <h1 className="text-2xl font-bold">
          You do not have permission to access this page.
        </h1>
      </div>
    );
  }

  return <>{children}</>;
}
