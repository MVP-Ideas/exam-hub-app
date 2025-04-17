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
import useDeleteUser from '@/hooks/users/useDeleteUser';

export default function DeleteUserModal({
	user,
	onClose,
}: {
	user: User;
	onClose: () => void;
}) {
	const { deleteUser, isPending } = useDeleteUser(user.id);

	const handleConfirm = async () => {
		await deleteUser();
		onClose();
	};

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
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
					<Button
						variant="destructive"
						disabled={isPending}
						onClick={handleConfirm}
					>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
