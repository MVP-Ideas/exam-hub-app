"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { UserResponse } from "@/lib/types/user";
import useUpdateUser from "@/hooks/users/useUpdateUser";
import { Label } from "../ui/label";

export function EditUserModal({
  user,
  onClose,
}: {
  user: UserResponse;
  onClose: () => void;
}) {
  const [name, setName] = useState(user.name);
  const { updateUser, isPending } = useUpdateUser(user.id);

  const handleSave = async () => {
    await updateUser({ name });
    onClose();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Name</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col">
          <Label htmlFor="name" className="mb-1 block text-sm font-medium">
            Name
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter new name"
          />
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={isPending} onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
