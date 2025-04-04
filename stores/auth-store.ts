import { create } from 'zustand';
import { TokenResponse } from '../types/auth';

type AuthStore = {
	accessToken: string | null;
	refreshToken: string | null;
	expiresAt: Date | null;

	login: (token: TokenResponse) => void;
	logout: () => void;
	refreshTokens: (token: TokenResponse) => void;

	setAccessToken: (accessToken: string | null) => void;
	getAccessToken: () => string | null;
};

const loadLocalState = <T>(key: string, defaultValue: T): T => {
	if (typeof window !== 'undefined') {
		try {
			const stored = localStorage.getItem(key);
			if (stored !== null) {
				return JSON.parse(stored) as T;
			}
		} catch (err) {
			console.warn(`Failed to parse localStorage key "${key}":`, err);
		}
	}
	return defaultValue;
};

const saveToLocalStorage = (key: string, value: unknown) => {
	if (typeof window !== 'undefined') {
		localStorage.setItem(key, JSON.stringify(value));
	}
};

const initialState = {
	accessToken: null,
	refreshToken: null,
	expiresAt: null,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
	accessToken: loadLocalState('accessToken', null),
	refreshToken: loadLocalState('refreshToken', null),
	expiresAt: loadLocalState('expiresAt', null),
	login: ({ accessToken, refreshToken, expiresAt }) => {
		set({ accessToken, refreshToken, expiresAt });
		saveToLocalStorage('accessToken', accessToken);
		saveToLocalStorage('refreshToken', refreshToken);
		saveToLocalStorage('expiresAt', expiresAt);
	},

	logout: () => {
		set(initialState);
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('expiresAt');
	},

	refreshTokens: ({ accessToken, refreshToken, expiresAt }) => {
		set({ accessToken, refreshToken, expiresAt });
		saveToLocalStorage('accessToken', accessToken);
		saveToLocalStorage('refreshToken', refreshToken);
		saveToLocalStorage('expiresAt', expiresAt);
		if (typeof window !== 'undefined') {
			window.location.reload();
		}
	},

	setAccessToken: (accessToken: string | null) => {
		set({ accessToken });
		saveToLocalStorage('accessToken', accessToken);
	},
	getAccessToken: () => get().accessToken,
}));
