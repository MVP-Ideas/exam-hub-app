"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteUserModal from "@/components/user/delete-user-modal";
import { EditUserModal } from "@/components/user/edit-user-modal";
import {
  LearnerCard,
  LearnerCardHorizontal,
} from "@/components/user/learner-card";
import useDebouncedValue from "@/hooks/common/useDebouncedValue";
import useInfiniteUsers from "@/hooks/users/useInfiniteUsers";
import { User } from "@/lib/types/user";
import { LayoutGrid, List, Search, UserIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  const [viewMode, setViewMode] = useState("grid");

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      page: page,
      pageSize: 12, // Increased for card layout
      role: "Learner",
    }),
    [debouncedSearch, page],
  );

  const {
    users,
    totalItems,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteUsers(queryParams);

  const { ref: loaderRef, inView } = useInView({
    rootMargin: "300px",
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
      setPage((prev) => prev + 1);
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }

    const queryString = params.toString();

    router.push(`?${queryString}`, { scroll: false });
  }, [debouncedSearch, router]);

  return (
    <div className="flex min-h-screen w-full flex-col p-10 md:h-full md:pb-0">
      <div className="flex h-full w-full flex-col gap-6">
        {/* Header */}
        <div className="flex w-full flex-col items-start">
          <h1 className="text-2xl font-bold">Learner Management</h1>
          <p className="text-sm">
            Manage learners, track progress, and organize groups
          </p>
        </div>

        {/* Search */}
        <div className="bg-background border-primary/20 flex w-full flex-col gap-4 rounded-lg">
          <Input
            icon={<Search size={16} className="text-muted-foreground" />}
            placeholder="Search learners...."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />

          {/* Loading State */}
          {isLoading &&
            (viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-background border-primary/20 rounded-lg border p-6"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="mb-2 h-5 w-32" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                      <Skeleton className="h-20 rounded-lg" />
                      <Skeleton className="h-20 rounded-lg" />
                      <Skeleton className="col-span-2 h-20 rounded-lg md:col-span-1" />
                    </div>
                    <div className="border-primary/10 flex space-x-2 border-t pt-4">
                      <Skeleton className="h-10 flex-1" />
                      <Skeleton className="h-10 w-10" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-background border-primary/20 flex rounded-lg border p-6"
                  >
                    <div className="w-2 bg-gray-200" />
                    <div className="ml-2 flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div>
                            <Skeleton className="mb-2 h-5 w-32" />
                            <Skeleton className="h-4 w-48" />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-6 w-16 rounded-full" />
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <Skeleton className="h-12 rounded-lg" />
                        <Skeleton className="h-12 rounded-lg" />
                        <Skeleton className="h-12 rounded-lg" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}

          {/* Error State */}
          {isError && (
            <div className="bg-muted flex h-40 w-full flex-col items-center justify-center gap-4 rounded-lg">
              <p className="text-destructive font-bold">
                Failed to load learners. Please try again.
              </p>
            </div>
          )}

          {/* View mode toggle */}
          <div className="flex w-full flex-row items-center justify-end gap-2">
            {/* Total count display */}
            {!isLoading && !isError && users && users.length > 0 && (
              <div className="text-muted-foreground text-xs text-nowrap">
                Showing {users.length} of {totalItems} learner(s)
              </div>
            )}
            <div className="border-muted-foreground/30 bg-muted flex w-full border-b" />
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              className="h-10 w-10"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid size={16} />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              className="h-10 w-10"
              onClick={() => setViewMode("list")}
            >
              <List size={16} />
            </Button>
          </div>

          {/* Learner Cards */}
          {!isLoading && !isError && users && (
            <>
              {users.length === 0 ? (
                <div className="bg-muted flex h-40 w-full flex-col items-center justify-center gap-4 rounded-lg">
                  <UserIcon size={40} className="text-muted-foreground" />
                  <p className="text-muted-foreground font-bold">
                    No learners found.
                  </p>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 gap-6 lg:grid-cols-2"
                      : "flex flex-col gap-4"
                  }
                >
                  {users.map((learner) =>
                    viewMode === "grid" ? (
                      <LearnerCard
                        key={learner.id}
                        learner={learner}
                        onEdit={setEditUser}
                        onDelete={setDeleteUser}
                      />
                    ) : (
                      <LearnerCardHorizontal
                        key={learner.id}
                        learner={learner}
                        onEdit={setEditUser}
                        onDelete={setDeleteUser}
                      />
                    ),
                  )}

                  {/* Infinite scroll loader */}
                  {hasNextPage && (
                    <div ref={loaderRef} className="h-4 w-full text-center">
                      {isFetching && (
                        <p className="text-muted-foreground text-sm">
                          Loading more...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {editUser && (
        <EditUserModal user={editUser} onClose={() => setEditUser(null)} />
      )}

      {/* Delete User Modal */}
      {deleteUser && (
        <DeleteUserModal
          user={deleteUser}
          onClose={() => setDeleteUser(null)}
        />
      )}
    </div>
  );
}
