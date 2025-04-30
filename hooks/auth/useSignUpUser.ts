import { extractAxiosErrorMessage } from "@/lib/utils";
import AuthService from "@/lib/services/auth-service";
import { UserLocalRegister } from "@/lib/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useSignUpUser = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: signUpUser } = useMutation({
    mutationFn: async (request: UserLocalRegister) =>
      await AuthService.localRegister(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
      throw new Error(message);
    },
  });

  return { signUpUser };
};

export default useSignUpUser;
