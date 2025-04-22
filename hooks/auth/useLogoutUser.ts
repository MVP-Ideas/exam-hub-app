import { extractAxiosErrorMessage } from "@/lib/utils";
import AuthService from "@/lib/services/auth-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useLogoutUser = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: logoutUser } = useMutation({
    mutationFn: async () => await AuthService.logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
      throw new Error(message);
    },
  });

  return { logoutUser };
};

export default useLogoutUser;
