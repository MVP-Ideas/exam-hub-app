export type User = {
  id: string;
  lastLoginAt: Date | null;
  lastActiveAt: Date | null;
  role: "Admin" | "Learner";
  email: string;
  name: string;
  accountType: string;
  preferences: UserPreference[];
  analytics: UserAnalytics;
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

export type UserAnalytics = {
  completedExams: number;
  totalExams: number;
  averageScore: number;
}