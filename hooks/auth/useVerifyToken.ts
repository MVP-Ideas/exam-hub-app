import AuthService from '@/services/auth-service';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useMutation } from '@tanstack/react-query';

const useVerifyToken = () => {
	const { getAccessToken } = useAuthStore();

	const { mutateAsync: verifyToken, isPending: isLoading } = useMutation({
		mutationFn: async () => {
			const token = getAccessToken();
			if (!token) throw new Error('No access token');
			return await AuthService.verifyToken();
		},
		onSuccess: (verified) => {
			if (!verified) {
				throw new Error('Token verification failed');
			}
		},
		onError: (err) => {
			console.error('Token verification failed:', err);
		},
	});

	return {
		verifyToken,
		isLoading,
	};
};

export default useVerifyToken;
