'use client';

import { useState } from 'react';
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

	const [isLoading, setIsLoading] = useState(false);
	const { signUpOrLoginB2C } = useSignUpOrLoginUserB2C();

	const isInProgress = inProgress !== 'none';

	const isAuthenticatedLocal = !!accessToken;
	const isAuthenticated =
		(isAuthenticatedB2C && accessToken) || isAuthenticatedLocal;

	const handleLogout = () => {
		setIsLoading(true);
		if (isAuthenticatedB2C) {
			instance.logoutPopup();
		}
		setAccessToken(null);
		setIsLoading(false);
	};

	const handleLoginB2C = async (provider: string | null) => {
		setIsLoading(true);

		try {
			const loginResult = await instance.loginPopup({
				scopes: loginScopes,
				domainHint: `${provider}.com`,
			});

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

			const response = await signUpOrLoginB2C({
				request: b2cRequest,
				accessToken: tokenResponse.accessToken,
			});

			if (response) {
				setAccessToken(tokenResponse.accessToken);
				toast.success('Login successful');
			} else {
				throw new Error();
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
