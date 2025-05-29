"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserState, useUserStore } from "@/lib/stores/user-store";
import AppLoader from "@/components/common/app-loader";

export default function AdminProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathName = usePathname();
  const { user } = useUserStore((state: UserState) => ({
    user: state.user,
  }));

  useEffect(() => {
    if (user && user.role?.toLowerCase() !== "admin") {
      router.replace("/");
    }
  }, [user, pathName, router]);

  if (!user) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <AppLoader />
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
