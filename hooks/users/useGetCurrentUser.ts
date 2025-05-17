import UserService from "@/lib/services/user-service";
import { useQuery } from "@tanstack/react-query";

const useGetCurrentUser = () => {
  const {
    data: user,
    isLoading,
    isError,
    isSuccess,
    isFetched,
    error,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => await UserService.getCurrentUser(),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    staleTime: 0, // always considered stale
  });

  return {
    user,
    isLoading,
    isError,
    isSuccess,
    isFetched,
    error,
  };
};

export default useGetCurrentUser;
