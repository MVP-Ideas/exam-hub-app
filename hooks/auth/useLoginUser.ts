import { extractAxiosErrorMessage } from '@/lib/utils';
import AuthService from '@/services/auth-service';
import { useAuthStore } from '@/lib/stores/auth-store';
import { UserLocalLogin } from '@/types/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const useLoginUser = () => {
	const { login } = useAuthStore();
	const queryClient = useQueryClient();
	const { mutateAsync: loginUser } = useMutation({
		mutationFn: async (request: UserLocalLogin) =>
			await AuthService.localLogin(request),
		onSuccess: (data) => {
			login(data.data);
			queryClient.invalidateQueries({ queryKey: ['currentUser'] });
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
