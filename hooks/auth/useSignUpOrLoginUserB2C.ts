import { extractAxiosErrorMessage } from '@/lib/utils';
import AuthService from '@/services/auth-service';
import { UserB2CLoginRegister } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const useSignUpOrLoginUserB2C = () => {
	const { mutateAsync: signUpOrLoginB2C } = useMutation({
		mutationFn: async (request: UserB2CLoginRegister) => {
			try {
				const response = await AuthService.b2cLoginRegister(request);
				toast.success('Login successful');
				return response;
			} catch (error) {
				const message = extractAxiosErrorMessage(error as Error);
				toast.error(message);
				throw new Error(message);
			}
		},
	});

	return { signUpOrLoginB2C };
};

export default useSignUpOrLoginUserB2C;
