import { extractAxiosErrorMessage } from '@/lib/utils';
import AuthService from '@/services/auth-service';
import { useAuthStore } from '@/stores/auth-store';
import { UserLocalRegister } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const useSignUpUser = () => {
	const authStore = useAuthStore();

	const { mutateAsync: signUpUser } = useMutation({
		mutationFn: async (request: UserLocalRegister) =>
			await AuthService.localRegister(request),
		onSuccess: (data) => {
			authStore.login(data);
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
