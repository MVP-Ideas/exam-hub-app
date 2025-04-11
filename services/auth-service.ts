import api from '@/lib/axios';
import { isProblemDetails } from '@/lib/utils';
import {
	TokenResponse,
	UserB2CLoginRegister,
	UserLocalLogin,
	UserLocalRegister,
} from '@/types/auth';

const BASE_URL = 'auth';

const AuthService = {
	localLogin: async (request: UserLocalLogin) =>
		api.post<TokenResponse>(`${BASE_URL}/login`, request),
	localRegister: async (request: UserLocalRegister) => {
		const response = await api.post<TokenResponse>(
			`${BASE_URL}/register`,
			request
		);
		if (isProblemDetails(response.data)) throw response.data;
		return response.data;
	},

	b2cLoginRegister: async (
		request: UserB2CLoginRegister,
		accessToken: string
	) => {
		const response = await api.post<boolean>(`${BASE_URL}/b2c`, request, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		if (isProblemDetails(response.data)) throw response.data;
		return response.data;
	},

	verifyToken: async () => {
		const response = await api.post<boolean>(`${BASE_URL}/verify`);
		if (isProblemDetails(response.data)) throw response.data;
		return response.data;
	},

	logout: async () => {
		await api.post(`${BASE_URL}/logout`);
	},
};

export default AuthService;
