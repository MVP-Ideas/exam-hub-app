import { CreateAnswerRequest } from "./answer";
import { ExamExamSessionResponse } from "./exam";
import {
  ExamSessionQuestionResponse,
  ExamSessionQuestionResultResponse,
} from "./exam-session-question";
import { ExamSettingsResponse } from "./exam-settings";
import { UserExamSessionResponse } from "./user";

// Query
export type ExamSessionsQuery = {
  status?: string;
  userIds?: string;
  examId?: string;
  page?: number;
  pageSize?: number;
};

// Requests
export type ExamSessionProgressRequest = {
  timeSpentSeconds: number;
  answers: CreateAnswerRequest[];
};

export enum RetakeOptions {
  FullRetake = "FullRetake",
  MissedQuestionsRetake = "MissedQuestionsRetake",
  AiAssistedRetake = "AiAssistedRetake",
}

export type ExamSessionRetakeRequest = {
  retakeOption: RetakeOptions;
};

export type ExamSessionStartRequest = {
  examId: string;
  questionIds: string[];
};

// Responses
export type ExamSessionPaginatedResponse = {
  id: string;
  user: UserExamSessionResponse;
  exam: ExamExamSessionResponse;
  startedAt: string;
  timeSpentSeconds: number;
  maxTimeSeconds?: number;
  status: string;
  finishedAt?: string;
};

export type ExamSessionPracticeOptionsResponse = {
  isFullRetakeAvailable: boolean;
  isMissedQuestionsRetakeAvailable: boolean;
  isAssistedQuestionsRetakeAvailable: boolean;
};

export type ExamSessionResponse = {
  id: string;
  userId: string;
  exam: ExamExamSessionResponse;
  startedAt: string;
  timeSpentSeconds: number;
  maxTimeSeconds?: number;
  status: string;
  finishedAt?: string;
  questions: ExamSessionQuestionResponse[];
  settings: ExamSettingsResponse;
};

export type ExamSessionResultResponse = {
  id: string;
  userId: string;
  userName: string;
  status: string;
  examTitle: string;
  examId: string;
  score: number;
  totalScore: number;
  finishedAt: string;
  timeSpentSeconds: number;
  passingScore: number;
  passingFlag: string;
  questions: ExamSessionQuestionResultResponse[];
};
