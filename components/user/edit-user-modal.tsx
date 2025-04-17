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
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { User } from '@/types/user';
import useUpdateUser from '@/hooks/users/useUpdateUser';

export function EditUserModal({
	user,
	onClose,
}: {
	user: User;
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

				<Input
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Enter new name"
				/>

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
