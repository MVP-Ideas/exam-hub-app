"use client";

import { Skeleton } from "@/components/ui/skeleton";
import useInfiniteUsers from "@/hooks/users/useInfiniteUsers";
import { LearnerStatistics } from "@/lib/types/statistics";
import { useMemo } from "react";

export default function LearnerMetrics() {
  // Empty search for all learners
  const debouncedSearch = "";

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      page: 1,
      pageSize: 100,
      role: "Learner",
    }),
    [debouncedSearch],
  );

  const { users, totalItems, isLoading } = useInfiniteUsers(queryParams);

  // Calculate active users (active within the last 7 days)
  const activeThisWeek = useMemo(() => {
    if (!users) return 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return users.filter(
      (user) => user.lastLoginAt && new Date(user.lastLoginAt) >= sevenDaysAgo,
    ).length;
  }, [users]);

  // Calculate inactive users
  const inactiveUsers = useMemo(() => {
    if (!users) return 0;
    return users.length - activeThisWeek;
  }, [users, activeThisWeek]);

  const statistics: LearnerStatistics = useMemo(
    () => ({
      totalLearners: totalItems || 0,
      activeLearners: activeThisWeek,
      inactiveLearners: inactiveUsers,
    }),
    [totalItems, activeThisWeek, inactiveUsers],
  );

  return (
    <div className="bg-background flex w-full flex-col gap-4 rounded-lg border p-6">
      <div className="border-primary/50 bg-primary/5 flex w-full flex-col gap-2 rounded-lg border px-6 py-4">
        <p className="text-primary text-xs font-bold">Total Learners</p>
        {isLoading && <Skeleton className="h-4 w-full" />}
        {!isLoading && (
          <p className="text-xl font-bold">{statistics.totalLearners}</p>
        )}
      </div>
      <div className="flex w-full flex-col gap-2 rounded-lg border border-green-500 bg-green-50 px-6 py-4 dark:border-green-500 dark:bg-green-900/20">
        <p className="text-xs font-bold text-green-500">Active This Week</p>
        {isLoading && <Skeleton className="h-4 w-full" />}
        {!isLoading && (
          <p className="text-xl font-bold">{statistics.activeLearners}</p>
        )}
      </div>
      <div className="flex w-full flex-col gap-2 rounded-lg border border-fuchsia-500 bg-fuchsia-50 px-6 py-4 dark:border-fuchsia-500 dark:bg-fuchsia-900/20">
        <p className="text-xs font-bold text-fuchsia-500">Inactive Learners</p>
        {isLoading && <Skeleton className="h-4 w-full" />}
        {!isLoading && (
          <p className="text-xl font-bold">{statistics.inactiveLearners}</p>
        )}
      </div>
    </div>
  );
}
