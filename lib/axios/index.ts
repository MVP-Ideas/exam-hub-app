import axios from 'axios';
import { getAuthToken } from '../auth/getAuthToken';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(
	async (config) => {
		const token = await getAuthToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Optional: logout, refresh, or redirect
		}
		return Promise.reject(error);
	}
);

export default api;
