import { create } from 'zustand';
import { TokenResponse } from '../types/auth';
import { User } from '@/types/user';

type AuthStore = {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	expiresAt: Date | null;

	login: (token: TokenResponse) => void;
	logout: () => void;
	refreshTokens: (token: TokenResponse) => void;

	setAccessToken: (accessToken: string | null) => void;
	getAccessToken: () => string | null;
	getRefreshToken: () => string | null;
	setUser: (user: User | null) => void;
	getUser: () => User | null;
};

const loadLocalState = <T>(key: string, defaultValue: T): T => {
	if (typeof window === 'undefined') return defaultValue;

	try {
		const stored = localStorage.getItem(key);
		if (stored == null) return defaultValue;

		// Try parsing — if it's a valid JSON object/array, return parsed
		const firstChar = stored.trim()[0];
		if (firstChar === '{' || firstChar === '[') {
			return JSON.parse(stored) as T;
		}

		// Otherwise, assume it's a plain string
		return stored as T;
	} catch (err) {
		console.warn(`Failed to parse localStorage key "${key}":`, err);
		return defaultValue;
	}
};

const saveToLocalStorage = (key: string, value: unknown) => {
	if (typeof window === 'undefined') return;

	try {
		if (typeof value === 'string') {
			localStorage.setItem(key, value);
		} else {
			localStorage.setItem(key, JSON.stringify(value));
		}
	} catch (err) {
		console.warn(`Failed to save localStorage key "${key}":`, err);
	}
};

const initialState = {
	accessToken: null,
	refreshToken: null,
	expiresAt: null,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
	user: loadLocalState('user', null),
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
		localStorage.removeItem('user');
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

	getRefreshToken: () => get().refreshToken,

	setUser: (user: User | null) => {
		set({ user });
		saveToLocalStorage('user', user);
	},

	getUser: () => get().user,
}));
