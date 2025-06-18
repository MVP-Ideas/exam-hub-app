"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronsUpDown, User as UserIcon, X, Search } from "lucide-react";
import useGetLearners from "@/hooks/users/useGetLearners";

type Props = {
  value?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  role?: string;
};

export default function UserMultiSelect({
  value = [],
  onChange,
  disabled = false,
  role = "Learner",
}: Props) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;

  const { learners, isLoading } = useGetLearners({
    search: searchQuery,
    page,
    pageSize,
    role,
  });

  const handleSelectUser = (userId: string) => {
    if (!onChange) return;

    const isSelected = value.includes(userId);

    if (isSelected) {
      onChange(value.filter((id) => id !== userId));
    } else {
      onChange([...value, userId]);
    }
  };

  const handleRemoveUser = (userId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (!onChange) return;
    onChange(value.filter((id) => id !== userId));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onChange) return;
    onChange([]);
  };

  const handleSelectAll = () => {
    if (!onChange || !learners.items) return;
    const newSelectedIds = [...value];

    learners.items.forEach((user) => {
      if (!newSelectedIds.includes(user.id)) {
        newSelectedIds.push(user.id);
      }
    });

    onChange(newSelectedIds);
  };

  // Get the selected users data
  const selectedUsers = learners.items.filter((user) =>
    value.includes(user.id),
  );

  // List of selected user IDs that are not in the current page
  const missingSelectedUserIds = value.filter(
    (id) => !learners.items.some((user) => user.id === id),
  );

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between"
          >
            <div className="text-muted-foreground flex items-center gap-2 truncate">
              <UserIcon className="text-muted-foreground h-4 w-4 shrink-0" />
              {value.length > 0
                ? `${value.length} user${value.length > 1 ? "s" : ""} selected`
                : "All Users"}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="popover-menu-content p-0">
          <div className="flex flex-col">
            <div className="flex items-center border-b p-2">
              <Search className="text-muted-foreground mr-2 h-4 w-4 shrink-0" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="flex items-center justify-between border-b p-2">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  disabled={isLoading}
                >
                  Select All
                </Button>
                {value.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleClearAll}>
                    Clear All
                  </Button>
                )}
              </div>
              <div className="text-muted-foreground text-xs">
                {value.length} selected
              </div>
            </div>

            {isLoading ? (
              <div className="text-muted-foreground p-4 text-center">
                Loading...
              </div>
            ) : (
              <ScrollArea className="h-72">
                <div className="p-1">
                  {learners.items.length === 0 ? (
                    <div className="text-muted-foreground p-4 text-center">
                      No users found
                    </div>
                  ) : (
                    learners.items.map((user) => (
                      <div
                        key={user.id}
                        className={`flex cursor-pointer items-center space-x-2 rounded-sm p-2 ${value.includes(user.id) ? "bg-muted" : "hover:bg-muted/50"} `}
                        onClick={() => handleSelectUser(user.id)}
                      >
                        <Checkbox
                          checked={value.includes(user.id)}
                          onCheckedChange={() => handleSelectUser(user.id)}
                        />
                        <div className="flex-1 overflow-hidden">
                          <p className="truncate font-medium">{user.name}</p>
                          <p className="text-muted-foreground truncate text-xs">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            )}

            {learners.totalPages > 1 && (
              <div className="flex items-center justify-between border-t p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-muted-foreground text-xs">
                  Page {page} of {learners.totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setPage((p) => Math.min(learners.totalPages, p + 1))
                  }
                  disabled={page === learners.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selectedUsers.map((user) => (
            <Badge key={user.id} variant="secondary" className="h-6">
              {user.name}
              <button
                className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-1"
                onClick={(e) => handleRemoveUser(user.id, e)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {missingSelectedUserIds.length > 0 && (
            <Badge variant="outline" className="h-6">
              +{missingSelectedUserIds.length} more
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
