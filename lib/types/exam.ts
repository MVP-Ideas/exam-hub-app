import { ExamCategoryExamResponse } from "./exam-category";
import {
  ExamQuestionExamResponse,
  UpsertExamQuestionRequest,
} from "./exam-question";
import {
  UpsertExamSettingsRequest,
  ExamSettingsResponse,
} from "./exam-settings";
import { ResourceResponse } from "./resource";

// Query
export type SearchParams = {
  search?: string;
  page?: number;
  pageSize?: number;
  difficulty?: string | null;
  category?: string | null;
  status?: string | null;
};

// Requests
export type CreateExamRequest = {
  title: string;
  description: string;
  categoryIds: string[];
  difficulty: string;
  durationSeconds?: number;
  passingScore: number;
  resourceIds: string[];
  isDraft: boolean;
  questions: UpsertExamQuestionRequest[];
  settings: UpsertExamSettingsRequest;
};

export type UpdateExamRequest = {
  title: string;
  description: string;
  categoryIds: string[];
  difficulty: string;
  durationSeconds?: number;
};

// Responses
export type ExamExamSessionResponse = {
  id: string;
  title: string;
  resources: ResourceResponse[];
};

export type ExamExistingOngoingSessionResponse = {
  existingExamSessionId: string;
  lastUpdated: string;
};

export type ExamFromQuestionResponse = {
  id: string;
  title: string;
  createdAt: string;
  status: string;
};

export type ExamListResponse = {
  id: string;
  title: string;
};

export type ExamPaginatedResponse = {
  id: string;
  title: string;
  description: string;
  durationSeconds?: number;
  passingScore: number;
  version: number;
  status: string;
  difficulty: string;
  createdAt: string;
  updatedAt: string;
  categories: ExamCategoryExamResponse[];
  questions: ExamQuestionExamResponse[];
};

export type ExamPreviousSessionResponse = {
  examSessionId: string;
  finishedAt: string;
  scorePercentage: number;
  passingFlag: string;
  status: string;
};

export type ExamResponse = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  durationSeconds: number;
  passingScore: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  isFeatured: boolean;
  settings: ExamSettingsResponse;
  categories: ExamCategoryExamResponse[];
  resources: ResourceResponse[];
  questions: ExamQuestionExamResponse[];
};

export type ExamWithUserMetadata = ExamResponse & {
  existingOngoingSession: ExamExistingOngoingSessionResponse;
  previousSessions: ExamPreviousSessionResponse[];
};
