import AuthService from '@/services/auth-service';
import { UserB2CLoginRegister } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';

const useSignUpOrLoginUserB2C = () => {
	const { mutateAsync: signUpOrLoginB2C } = useMutation({
		mutationFn: async ({
			request,
			accessToken,
		}: {
			request: UserB2CLoginRegister;
			accessToken: string;
		}) => {
			const response = await AuthService.b2cLoginRegister(request, accessToken);
			return response;
		},
	});

	return { signUpOrLoginB2C };
};

export default useSignUpOrLoginUserB2C;
