"use client";

import learnerColumn from "@/components/admin/learner-management/learner-column";
import DataTable from "@/components/common/data-table";
import { Input } from "@/components/ui/input";
import DeleteUserModal from "@/components/user/delete-user-modal";
import { EditUserModal } from "@/components/user/edit-user-modal";
import useDebouncedValue from "@/hooks/common/useDebouncedValue";
import useGetLearners from "@/hooks/users/useGetLearners";
import { User } from "@/lib/types/user";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BeatLoader } from "react-spinners";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  const columns = learnerColumn({
    onEditUser: setEditUser,
    onDeleteUser: setDeleteUser,
  });

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      page: page,
      pageSize: 10,
      role: "Learner",
    }),
    [debouncedSearch, page],
  );

  const { learners, isLoading, isError } = useGetLearners(queryParams);

  const activeThisWeek = useMemo(() => {
    if (!learners) return 0;
    return learners.items.filter((learner) => {
      if (!learner.lastLoginAt) return false;
      const lastActiveDate = new Date(learner.lastLoginAt);
      const now = new Date();
      const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
      return lastActiveDate >= oneWeekAgo;
    }).length;
  }, [learners]);

  const table = useReactTable({
    data: learners?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleNextPage = () => {
    if (learners && learners.page < learners.totalPages) {
      setPage(learners.page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (learners && learners.page > 1) {
      setPage(learners.page - 1);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams({
      search: debouncedSearch,
      page: page.toString(),
    }).toString();

    router.push(`?${queryParams}`, { scroll: false });
  }, [debouncedSearch, page, router]);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex h-full w-full max-w-5xl flex-col items-center gap-6 p-10">
        <div className="w-full">
          <h1 className="text-2xl font-bold">Learner Management</h1>
          <p className="text-sm">
            Manage learners, track progress, and organize groups
          </p>
        </div>
        <div className="bg-background border-primary/20 flex w-full flex-col gap-4 rounded-lg border p-6">
          <div className="border-primary/50 bg-primary/5 flex w-full flex-col gap-2 rounded-lg border px-6 py-4">
            <p className="text-primary text-xs font-bold">Total Learners</p>
            {isLoading && <BeatLoader className="py-2" size={5} />}
            {!isLoading && (
              <p className="text-xl font-bold">{learners?.totalItems || 0}</p>
            )}
          </div>
          <div className="flex w-full flex-col gap-2 rounded-lg border border-green-500 bg-green-50 px-6 py-4">
            <p className="text-xs font-bold text-green-500">Active This Week</p>
            {isLoading && <BeatLoader className="py-2" size={5} />}
            {!isLoading && (
              <p className="text-xl font-bold">{activeThisWeek}</p>
            )}
          </div>
          <div className="flex w-full flex-col gap-2 rounded-lg border border-fuchsia-500 bg-fuchsia-50 px-6 py-4">
            <p className="text-xs font-bold text-fuchsia-500">
              Average Completion Rate
            </p>
            <p className="text-xl font-bold">78%</p>
          </div>
        </div>
        <div className="bg-background border-primary/20 flex w-full flex-col gap-4 rounded-lg border p-6">
          <Input
            icon={<Search size={16} className="text-muted-foreground" />}
            placeholder="Search learners...."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />

          <DataTable
            table={table}
            columns={columns}
            isLoading={isLoading}
            isError={isError}
            pagination={learners}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
          />
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
