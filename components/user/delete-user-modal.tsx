import useDeleteUser from "@/hooks/users/useDeleteUser";
import { UserResponse } from "@/lib/types/user";
import ConfirmDeleteDialog from "../common/dialogs/confirm-delete-dialog";

export default function DeleteUserModal({
  user,
  onClose,
}: {
  user: UserResponse;
  onClose: () => void;
}) {
  const { deleteUser, isPending } = useDeleteUser(user.id);

  const handleDeleteUser = async () => {
    try {
      await deleteUser();
      onClose();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <ConfirmDeleteDialog
      title="Delete User"
      description={`Are you sure you want to delete ${user.name}? This action cannot be undone.`}
      onConfirm={handleDeleteUser}
      onClose={onClose}
      isPending={isPending}
    />
  );
}
