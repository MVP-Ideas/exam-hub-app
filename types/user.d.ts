export type User = {
    role: string;
    email: string;
    name: string;
    accountType: string;
    preferences: UserPreference[];
}

export type UserPreference = {
    key: string;
    value: string;
}