import { extractAxiosErrorMessage } from "@/lib/utils";
import AuthService from "@/lib/services/auth-service";
import { UserLocalLogin } from "@/lib/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useLoginUser = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: loginUser } = useMutation({
    mutationFn: async (request: UserLocalLogin) =>
      await AuthService.localLogin(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      console.log(error);
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
      throw new Error(message);
    },
  });

  return { loginUser };
};

export default useLoginUser;
