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
    retry: false, // no retries
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    staleTime: 1000 * 60 * 5,
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
