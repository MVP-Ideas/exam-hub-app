"use client";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteUserModal from "@/components/user/DeleteUserModal";
import { EditUserModal } from "@/components/user/EditUserModal";
import { LearnerCardHorizontal } from "@/components/user/LearnerCard";
import useDebouncedValue from "@/hooks/common/useDebouncedValue";
import useInfiniteUsers from "@/hooks/users/useInfiniteUsers";
import { UserResponse } from "@/lib/types/user";
import { Search, UserIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [editUser, setEditUser] = useState<UserResponse | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserResponse | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      page: page,
      pageSize: 12,
      role: "Learner",
    }),
    [debouncedSearch, page],
  );

  const { users, isLoading, isError, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteUsers(queryParams);

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
    <div className="flex h-full min-h-screen w-full flex-col items-center p-10">
      <div className="flex h-full w-full flex-col gap-4">
        {/* Header */}
        <div className="flex w-full flex-col items-start">
          <h1 className="text-2xl font-bold md:text-2xl">Learner Management</h1>
          <p className="text-muted-foreground text-xs md:text-sm">
            Manage learners, track progress, and organize groups
          </p>
        </div>

        {/* Search */}
        <div className="bg-background flex w-full flex-col gap-3 rounded-lg">
          <Input
            icon={<Search size={16} className="text-muted-foreground" />}
            placeholder="Search learners...."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-background border-primary/20 flex rounded-lg border p-3"
                >
                  <div className="w-1 bg-gray-200" />
                  <div className="ml-2 flex flex-1 flex-col">
                    <div className="flex flex-col gap-2 md:flex-row md:justify-between">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div>
                          <Skeleton className="mb-1 h-4 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-5 w-12 rounded-full" />
                        <Skeleton className="h-7 w-12" />
                        <Skeleton className="h-7 w-7" />
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-1 md:grid-cols-3 md:gap-2">
                      <Skeleton className="h-8 rounded-lg" />
                      <Skeleton className="h-8 rounded-lg" />
                      <Skeleton className="h-8 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="bg-muted flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg">
              <p className="text-destructive text-sm font-bold">
                Failed to load learners. Please try again.
              </p>
            </div>
          )}

          {/* Learner Cards */}
          {!isLoading && !isError && users && (
            <>
              {users.length === 0 ? (
                <div className="bg-muted flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg">
                  <UserIcon size={32} className="text-muted-foreground" />
                  <p className="text-muted-foreground text-sm font-bold">
                    No learners found.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {users.map((learner) => (
                    <LearnerCardHorizontal
                      key={learner.id}
                      learner={learner}
                      onEdit={setEditUser}
                      onDelete={setDeleteUser}
                    />
                  ))}

                  {/* Infinite scroll loader */}
                  {hasNextPage && (
                    <div ref={loaderRef} className="h-4 w-full text-center">
                      {isFetching && (
                        <p className="text-muted-foreground text-xs">
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
