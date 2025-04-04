import { getMsalInstance, loginScopes } from '@/config/auth-config';
import { useAuthStore } from '@/stores/auth-store';

export const getAuthToken = async (): Promise<string | null> => {
	const localToken = useAuthStore.getState().getAccessToken();
	if (localToken) return localToken;

	try {
		const msalInstance = await getMsalInstance();
		const accounts = msalInstance.getAllAccounts();
		if (accounts.length === 0) return null;

		const response = await msalInstance.acquireTokenSilent({
			scopes: loginScopes,
			account: accounts[0],
		});

		// Optional: cache the refreshed token
		useAuthStore.getState().setAccessToken(response.accessToken);
		return response.accessToken;
	} catch (err) {
		console.warn('Token fetch failed:', err);
		return null;
	}
};
