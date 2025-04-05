import AuthService from '@/services/auth-service';
import { UserB2CLoginRegister } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const useSignUpOrLoginUserB2C = () => {
	const { mutateAsync: signUpOrLoginB2C } = useMutation({
		mutationFn: async (request: UserB2CLoginRegister) => {
			const response = await AuthService.b2cLoginRegister(request);
			return response;
		},
		onSuccess: () => {
			toast.success('Login successful');
		},
	});

	return { signUpOrLoginB2C };
};

export default useSignUpOrLoginUserB2C;
