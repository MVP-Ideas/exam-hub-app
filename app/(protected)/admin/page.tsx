"use client";

import PlatformMetrics from "@/components/admin/landing/platform-metrics";
import { Badge } from "@/components/ui/badge";
import { UserState, useUserStore } from "@/lib/stores/user-store";

export default function Page() {
  const { user } = useUserStore((state: UserState) => ({
    user: state.user,
  }));

  return (
    <div className="flex h-full w-full flex-col items-center gap-6 p-10">
      <div className="flex h-full w-full flex-col gap-6">
        <div className="flex h-fit w-full flex-col items-center justify-between gap-4 md:flex-row md:items-start">
          <h1 className="text-center text-2xl font-bold">
            Welcome back, {user?.name}!
          </h1>

          <div className="flex flex-row items-center gap-4">
            <Badge className="bg-primary px-6 py-2">
              <h1 className="font-bold">Admin Mode</h1>
            </Badge>
          </div>
        </div>

        <PlatformMetrics />
      </div>
    </div>
  );
}
