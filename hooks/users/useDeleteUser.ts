import UserService from "@/lib/services/user-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

const deleteUserRequest = async (id: string) => {
  const response = await UserService.delete(id);

  if (response) {
    return response;
  } else {
    throw new Error("Failed to delete user");
  }
};

const useDeleteUser = (id: string) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: deleteUser } = useMutation({
    mutationFn: () => deleteUserRequest(id),
    onSuccess: () => {
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: ["learners"] });
      });
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete user: ${error.message}`);
    },
  });

  return { deleteUser, isPending };
};

export default useDeleteUser;
