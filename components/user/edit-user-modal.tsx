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

export function EditUserModal({
	user,
	onClose,
	onSave,
}: {
	user: User;
	onClose: () => void;
	onSave?: (name: string) => void;
}) {
	const [name, setName] = useState(user.name);

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
					<Button
						onClick={() => {
							onSave?.(name);
							onClose();
						}}
					>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
