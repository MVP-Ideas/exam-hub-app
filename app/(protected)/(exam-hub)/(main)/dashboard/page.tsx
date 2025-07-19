"use client";

import RecommendedForYou from "@/components/learner/dashboard/RecommendedForYou";
import UserDashboardStatistics from "@/components/learner/dashboard/UserDashboardStatistics";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/stores/user-store";

export default function Page() {
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  return (
    <div className="flex h-full flex-col">
      <div className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name ?? "..."}!
          </h1>

          <div className="mt-6 flex flex-wrap gap-4">
            <Button className="rounded-md bg-white px-5 py-2 font-medium text-indigo-700 hover:bg-indigo-50">
              Start New Exam
            </Button>
            <Button className="rounded-md border border-indigo-500 bg-indigo-700 px-5 py-2 font-medium text-white hover:bg-indigo-600">
              Continue Practice
            </Button>
            <Button className="rounded-md border border-white bg-transparent px-5 py-2 font-medium text-white hover:bg-indigo-700">
              View Study Plan
            </Button>
          </div>
        </div>
      </div>

      <UserDashboardStatistics />
      <RecommendedForYou />
    </div>
  );
}
