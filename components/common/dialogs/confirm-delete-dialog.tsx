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

type ConfirmDeleteDialogProps = {
  title: string;
  description?: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  isOpen?: boolean;
  isPending?: boolean;
};

export default function ConfirmDeleteDialog({
  title,
  description,
  onConfirm,
  onClose,
  isOpen = true,
  isPending = false,
}: ConfirmDeleteDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
