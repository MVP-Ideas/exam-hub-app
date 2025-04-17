"use client";

import PlatformMetrics from "@/components/admin/landing/platform-metrics";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Edit, PlusCircle, Users } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const { user } = useAuthStore();

  return (
    <div className="flex w-full flex-col items-center gap-6 p-10">
      <div className="flex h-full w-full max-w-5xl flex-col gap-6">
        <div className="flex h-fit w-full flex-col items-center justify-between gap-4 md:flex-row md:items-start">
          <h1 className="text-center text-2xl font-bold">
            Welcome back, {user?.name}!
          </h1>

          <div className="flex flex-row items-center gap-4">
            <Badge className="bg-secondary px-6 py-2">
              <h1 className="font-bold">Admin Mode</h1>
            </Badge>
          </div>
        </div>
        <div className="flex w-full flex-row flex-wrap items-center justify-center gap-4 md:justify-start">
          <Link
            href="/admin/exams/create"
            className="bg-secondary text-background hover:bg-secondary/80 rounded-lg px-4 py-2"
          >
            <div className="flex flex-row items-center gap-3">
              <PlusCircle size={20} />
              <p className="text-sm font-bold">Create Exam</p>
            </div>
          </Link>
          <Link
            href="/admin/exams"
            className="border-primary/20 hover:bg-muted/20 rounded-lg border px-4 py-2"
          >
            <div className="flex flex-row items-center gap-3">
              <Edit size={16} />
              <p className="text-sm font-semibold">Edit Exam</p>
            </div>
          </Link>
          <Link
            href="/admin/learner-management"
            className="border-primary/20 hover:bg-muted/20 rounded-lg border px-4 py-2"
          >
            <div className="flex flex-row items-center gap-3">
              <Users size={16} />
              <p className="text-sm font-semibold">Manage Users</p>
            </div>
          </Link>
        </div>
        <PlatformMetrics />
      </div>
    </div>
  );
}
