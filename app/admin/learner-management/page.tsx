'use client';

import learnerColumn from '@/components/admin/learner-management/learner-column';
import DataTable from '@/components/common/data-table';
import { Input } from '@/components/ui/input';
import DeleteUserModal from '@/components/user/delete-user-modal';
import { EditUserModal } from '@/components/user/edit-user-modal';
import useDebouncedValue from '@/hooks/common/useDebouncedValue';
import useGetLearners from '@/hooks/users/useGetLearners';
import { User } from '@/types/user';
import {
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { ChevronLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { BeatLoader } from 'react-spinners';

export default function Page() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [search, setSearch] = useState(searchParams.get('search') ?? '');
	const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

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
			role: 'Learner',
		}),
		[debouncedSearch, page]
	);

	const { learners, isLoading } = useGetLearners(queryParams);

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

	const handleSaveUserName = (newName: string) => {
		// 🔧 Implement update logic here (e.g., API call, mutation)
		console.log('Saving new name for', editUser?.id, newName);
	};

	useEffect(() => {
		const queryParams = new URLSearchParams({
			search: debouncedSearch,
			page: page.toString(),
		}).toString();

		router.push(`?${queryParams}`, { scroll: false });
	}, [debouncedSearch, page, router]);

	return (
		<>
			<div className="flex flex-col w-full h-full p-10 gap-6">
				<div className="flex flex-row justify-between items-center w-full">
					<Link
						href={'/admin'}
						className="py-2 px-4 border border-primary/20 rounded-lg hover:bg-muted/20"
					>
						<div className="flex flex-row gap-1 items-center">
							<ChevronLeft size={16} />
							<p className="font-semibold text-xs">Back to Dashboard</p>
						</div>
					</Link>
				</div>
				<div className="w-full">
					<h1 className="text-2xl font-bold">Learner Management</h1>
					<p className="text-sm">
						Manage learners, track progress, and organize groups
					</p>
				</div>
				<div className="flex flex-col w-full bg-background p-6 border border-primary/20 rounded-lg gap-4">
					<div className="w-full border border-primary/50 bg-primary/5 rounded-lg py-4 px-6 flex flex-col gap-2">
						<p className="text-xs font-bold text-primary">Total Learners</p>
						{isLoading && <BeatLoader className="py-2" size={5} />}
						{!isLoading && (
							<p className="font-bold text-xl">{learners?.totalItems || 0}</p>
						)}
					</div>
					<div className="w-full border border-green-500 bg-green-50 rounded-lg py-4 px-6 flex flex-col gap-2">
						<p className="text-xs font-bold text-green-500">Active This Week</p>
						{isLoading && <BeatLoader className="py-2" size={5} />}
						{!isLoading && (
							<p className="font-bold text-xl">{activeThisWeek}</p>
						)}
					</div>
					<div className="w-full border border-fuchsia-500 bg-fuchsia-50 rounded-lg py-4 px-6 flex flex-col gap-2">
						<p className="text-xs font-bold text-fuchsia-500">
							Average Completion Rate
						</p>
						<p className="font-bold text-xl">78%</p>
					</div>
				</div>
				<div className="flex flex-col w-full bg-background p-6 border border-primary/20 rounded-lg gap-4">
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
						pagination={learners}
						onNextPage={handleNextPage}
						onPreviousPage={handlePreviousPage}
					/>
				</div>
			</div>

			{/* Edit User Modal */}
			{editUser && (
				<EditUserModal
					user={editUser}
					onClose={() => setEditUser(null)}
					onSave={handleSaveUserName}
				/>
			)}
			{/* Delete User Modal */}
			{deleteUser && (
				<DeleteUserModal
					user={deleteUser}
					onCancel={() => setDeleteUser(null)}
					onConfirm={() => {
						// 🔧 Implement delete logic here (e.g., API call, mutation)
						console.log('Deleting user', deleteUser.id);
						setDeleteUser(null);
					}}
				/>
			)}
		</>
	);
}
