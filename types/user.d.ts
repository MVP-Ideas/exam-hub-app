export type User = {
	id: string;
	lastLoginAt: Date | null;
	role: string;
	email: string;
	name: string;
	accountType: string;
	preferences: UserPreference[];
};

export type UserPreference = {
	id: string;
	key: string;
	value: string;
};
