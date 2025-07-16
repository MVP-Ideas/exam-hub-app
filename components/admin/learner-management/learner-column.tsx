import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getIsActive, getLastActiveDate } from "@/lib/date-utils";
import { UserResponse } from "@/lib/types/user";
import { ColumnDef } from "@tanstack/react-table";
import { Delete, Edit } from "lucide-react";

type Props = {
  onEditUser: (user: UserResponse) => void;
  onDeleteUser: (user: UserResponse) => void;
};

const learnerColumn = ({
  onEditUser,
  onDeleteUser,
}: Props): ColumnDef<UserResponse>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        disabled={table.getRowCount() === 0}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
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
    accessorKey: "name",
    header: () => <span>Name</span>,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex max-w-[175px] items-center gap-2">
          <p className="truncate font-bold">{user.name}</p>
        </div>
      );
    },
  },

  {
    accessorKey: "email",
    header: () => <span>Email</span>,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex max-w-[175px] items-center gap-2">
          <p className="truncate">{user.email}</p>
        </div>
      );
    },
  },

  {
    accessorKey: "examsCompleted",
    header: () => <span>Completed</span>,
    cell: () => {
      return (
        <div className="flex w-full gap-2">
          <p className="w-full text-center">1</p>
        </div>
      );
    },
  },

  {
    accessorKey: "averageScore",
    header: () => <span>Avg. Score</span>,
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <p className="w-full text-center">100%</p>
        </div>
      );
    },
  },

  {
    accessorKey: "lastActive",
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
    accessorKey: "status",
    header: () => <span>Status</span>,
    cell: ({ row }) => {
      const user = row.original;
      const isActive = getIsActive(user.lastLoginAt);
      return (
        <div className="flex w-fit items-center gap-2">
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
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="my-1 flex items-center">
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => onEditUser(user)}
          >
            <Edit />
          </Button>
          <Button
            variant="ghost"
            className="my-1 cursor-pointer"
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
