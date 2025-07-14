// Requests
export type UpdateUserRequest = {
  name?: string;
  preferences?: UserPreferenceUpdate[];
};

// Responses
export type UserAnalyticsResponse = {
  completedExams: number;
  totalExams: number;
  averageScore: number;
};

export type UserExamSessionResponse = {
  id: string;
  email: string;
  name: string;
};

export type UserPaginatedResponse = {
  id: string;
  email: string;
  name: string;
  accountType: string;
  lastLoginAt: Date | null;
  lastActiveAt: Date | null;
  analytics: UserAnalyticsResponse;
};

export type UserPreferenceResponse = {
  key: string;
  value: string;
};

export type UserPreferenceUpdate = {
  id?: string;
  key: string;
  value: string;
};

export type UserResponse = {
  id: string;
  lastLoginAt: Date | null;
  lastActiveAt: Date | null;
  role: "Admin" | "Learner";
  email: string;
  name: string;
  accountType: string;
  preferences: UserPreferenceResponse[];
  analytics: UserAnalyticsResponse;
};
