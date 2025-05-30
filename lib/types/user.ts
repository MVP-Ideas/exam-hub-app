export type User = {
  id: string;
  lastLoginAt: Date | null;
  role: "Admin" | "Learner";
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

export type UserUpdate = {
  name?: string;
  preferences?: UserPreferenceUpdate[];
};

export type UserPreferenceUpdate = {
  id?: string;
  key: string;
  value: string;
};
