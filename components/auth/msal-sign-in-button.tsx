import { useMsal } from '@azure/msal-react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { loginScopes } from '@/config/auth-config';
import { UserB2CLoginRegister } from '@/types/auth';
import useSignUpOrLoginUserB2C from '../../hooks/auth/useSignUpOrLoginUserB2C';

type Props = {
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
};

export const MsalSignInButton = ({ isLoading, setIsLoading }: Props) => {
	const { instance } = useMsal();
	const router = useRouter();
	const { signUpOrLoginB2C } = useSignUpOrLoginUserB2C();

	const handleLogin = async () => {
		setIsLoading(true);

		try {
			const loginResult = await instance.loginPopup({ scopes: loginScopes });

			if (!loginResult.account)
				throw new Error('Login failed: No account found');

			const account = loginResult.account;
			const tokenResponse = await instance.acquireTokenSilent({
				scopes: loginScopes,
				account,
			});

			const b2cRequest: UserB2CLoginRegister = {
				email: tokenResponse.account.username,
				name: tokenResponse.account.name ?? 'unknown',
				b2cUserId: tokenResponse.uniqueId,
				accountType: account.idTokenClaims?.idp ?? 'B2C',
			};

			await signUpOrLoginB2C(b2cRequest);

			router.push('/');
		} catch (error) {
			console.error('Login failed:', error);
			instance.logout();
			router.push('/login');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button disabled={isLoading} onClick={handleLogin}>
			Login using Email
		</Button>
	);
};
