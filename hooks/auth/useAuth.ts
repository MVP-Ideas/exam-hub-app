'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { useAuthStore } from '@/stores/auth-store';
import { loginScopes } from '@/config/auth-config';
import { UserB2CLoginRegister } from '@/types/auth';
import useSignUpOrLoginUserB2C from './useSignUpOrLoginUserB2C';
import { toast } from 'sonner';

const useAuth = () => {
	const isAuthenticatedB2C = useIsAuthenticated();
	const { inProgress, instance } = useMsal();
	const { accessToken, setAccessToken } = useAuthStore();

	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);
	const { signUpOrLoginB2C } = useSignUpOrLoginUserB2C();

	const isInProgress = inProgress !== 'none';

	const isAuthenticatedLocal = !!accessToken;
	const isAuthenticated = isAuthenticatedB2C || isAuthenticatedLocal;

	const handleLogout = () => {
		setIsLoading(true);
		setAccessToken(null);
		if (isAuthenticatedB2C) {
			instance.logoutPopup();
		}
		setIsLoading(false);
		router.push('/login');
	};

	const handleLoginB2C = async () => {
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

			const response = await signUpOrLoginB2C(b2cRequest);

			if (response) {
				setAccessToken(tokenResponse.accessToken);
				toast.success('Login successful');
			} else {
				throw new Error('Login failed: No response from server');
			}
		} catch {
			setAccessToken(null);
			handleLogout();
			toast.error('Login failed. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return {
		handleLoginB2C,
		handleLogout,
		isAuthenticated,
		isInProgress,
		isLoading,
	};
};

export default useAuth;
