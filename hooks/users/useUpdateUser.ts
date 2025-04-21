import UserService from "@/lib/services/user-service";
import { UserUpdate } from "@/lib/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

const updateUserRequest = async (id: string, request: UserUpdate) => {
  const response = await UserService.update(id, request);

  if (response) {
    return response;
  } else {
    throw new Error("Failed to update user");
  }
};

const useUpdateUser = (id: string) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: updateUser } = useMutation({
    mutationFn: (request: UserUpdate) => updateUserRequest(id, request),
    onSuccess: () => {
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: ["learners"] });
      });
      toast.success("User updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update user: ${error.message}`);
    },
  });

  return { updateUser, isPending };
};

export default useUpdateUser;
