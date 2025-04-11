import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { getIsActive, getLastActiveDate } from '@/lib/date-utils';
import { User } from '@/types/user';
import { ColumnDef } from '@tanstack/react-table';
import { Delete, Edit } from 'lucide-react';

type Props = {
	onEditUser: (user: User) => void;
	onDeleteUser: (user: User) => void;
};

const learnerColumn = ({
	onEditUser,
	onDeleteUser,
}: Props): ColumnDef<User>[] => [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				disabled={table.getRowCount() === 0}
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
	},
	{
		accessorKey: 'name',
		header: () => <span>Name</span>,
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="flex items-center gap-2 overflow-hidden">
					<p className="font-bold">{user.name}</p>
				</div>
			);
		},
	},

	{
		accessorKey: 'email',
		header: () => <span>Email</span>,
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="flex items-center gap-2">
					<p>{user.email}</p>
				</div>
			);
		},
	},

	{
		accessorKey: 'examsCompleted',
		header: () => <span>Exams Completed</span>,
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="flex items-center gap-2">
					<p>1</p>
				</div>
			);
		},
	},

	{
		accessorKey: 'averageScore',
		header: () => <span>Avg. Score</span>,
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="flex items-center gap-2">
					<p>100%</p>
				</div>
			);
		},
	},

	{
		accessorKey: 'lastActive',
		header: () => <span>Last Active</span>,
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="flex items-center gap-2">
					<p>{getLastActiveDate(user.lastLoginAt)}</p>
				</div>
			);
		},
	},

	{
		accessorKey: 'status',
		header: () => <span>Status</span>,
		cell: ({ row }) => {
			const user = row.original;
			const isActive = getIsActive(user.lastLoginAt);
			return (
				<div className="flex items-center gap-2 w-fit">
					{isActive ? (
						<Badge
							className="bg-green-100 text-green-600"
							variant="outline"
							color="green"
						>
							Active
						</Badge>
					) : (
						<Badge
							className="bg-muted text-muted-foreground"
							variant="outline"
							color="green"
						>
							Inactive
						</Badge>
					)}
				</div>
			);
		},
	},

	// Actions
	{
		id: 'actions',
		header: () => <span>Actions</span>,
		cell: ({ row }) => {
			const user = row.original;

			return (
				<div className="flex items-center my-1">
					<Button
						variant="ghost"
						className="cursor-pointer"
						onClick={() => onEditUser(user)}
					>
						<Edit />
					</Button>
					<Button
						variant="ghost"
						className="cursor-pointer my-1"
						onClick={() => onDeleteUser(user)}
					>
						<Delete className="text-destructive" />
					</Button>
				</div>
			);
		},
	},
];

export default learnerColumn;
