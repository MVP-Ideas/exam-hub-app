import api from '@/lib/axios';
import { isProblemDetails } from '@/lib/utils';
import { TokenResponse, UserB2CLoginRegister, UserLocalLogin, UserLocalRegister } from '@/types/auth';

const BASE_URL = 'auth';

const AuthService = {
	localLogin: async (request: UserLocalLogin) => {
		const response = await api.post<TokenResponse>(
			`${BASE_URL}/login`,
			request
		);
		if (isProblemDetails(response.data)) throw response.data;
		return response.data;
	},

	localRegister: async (request: UserLocalRegister) => {
		const response = await api.post<TokenResponse>(
			`${BASE_URL}/register`,
			request
		);
		if (isProblemDetails(response.data)) throw response.data;
		return response.data;
	},

	b2cLoginRegister: async (request: UserB2CLoginRegister) => {
		const response = await api.post<boolean>(
			`${BASE_URL}/b2c`,
			request
		);
		if (isProblemDetails(response.data)) throw response.data;
		return response.data;
	}
};

export default AuthService;
