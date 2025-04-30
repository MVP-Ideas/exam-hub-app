"use client";

import { useTransition } from "react";
import { extractAxiosErrorMessage } from "@/lib/utils";
import AuthService from "@/lib/services/auth-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useLogoutUser = () => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: performLogout } = useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
      throw new Error(message);
    },
  });

  // wrap the async logout in startTransition
  const logout = () => {
    startTransition(async () => {
      await performLogout();
    });
  };

  return { logout, isPending };
};

export default useLogoutUser;
