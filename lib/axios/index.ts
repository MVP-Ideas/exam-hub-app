/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (originalRequest?.url?.includes('/auth/acquire')) {
			return Promise.reject(error);
		}
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
			try {
				await api.post('/auth/acquire');

				return api(originalRequest); // Retry the original request with the new access token.
			} catch {
				return Promise.reject(error);
			}
		}
		return Promise.reject(error);
	}
);

export default api;
