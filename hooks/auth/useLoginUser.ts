import { extractAxiosErrorMessage } from '@/lib/utils';
import AuthService from '@/services/auth-service';
import { useAuthStore } from '@/stores/auth-store';
import { UserLocalLogin } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const useLoginUser = () => {
	const authStore = useAuthStore();
	const { mutateAsync: loginUser } = useMutation({
		mutationFn: async (request: UserLocalLogin) =>
			await AuthService.localLogin(request),
		onSuccess: (data) => {
			authStore.login(data);
		},
		onError: (error) => {
			const message = extractAxiosErrorMessage(error);
			toast.error(message);
			throw new Error(message);
		},
	});

	return { loginUser };
};

export default useLoginUser;
