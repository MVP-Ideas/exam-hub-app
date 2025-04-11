'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from '@/types/user';

export default function DeleteUserModal({
	user,
	onCancel,
	onConfirm,
}: {
	user: User;
	onCancel: () => void;
	onConfirm: () => void;
}) {
	return (
		<Dialog open onOpenChange={(open) => !open && onCancel()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete User</DialogTitle>
				</DialogHeader>

				<p className="text-sm text-muted-foreground">
					Are you sure you want to delete <strong>{user.name}</strong>? This
					action cannot be undone.
				</p>

				<DialogFooter className="mt-4">
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button variant="destructive" onClick={onConfirm}>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
