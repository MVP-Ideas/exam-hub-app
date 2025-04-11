import UserService from '@/services/user-service';
import { useAuthStore } from '@/stores/auth-store';
import { useQuery } from '@tanstack/react-query';

const useGetCurrentUser = () => {
	const { setUser } = useAuthStore();

	const {
		data: user,
		isLoading,
		isError,
		isSuccess,
		isFetched,
		error,
	} = useQuery({
		queryKey: ['currentUser'],
		queryFn: async () => {
			try {
				const response = await UserService.getCurrentUser();
				if (response) {
					setUser(response);
				} else {
					setUser(null);
				}
				return response;
			} catch (error) {
				setUser(null);
				throw error;
			}
		},
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
