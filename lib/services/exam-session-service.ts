import api from "../axios";
import { PaginationResponse } from "../types/pagination";
import {
  ExamSession,
  ExamSessionAnswerCreate,
  ExamSessionPaginated,
  ExamSessionPracticeOptions,
  ExamSessionQuestion,
  ExamSessionResult,
  RetakeOptions,
} from "../types/exam-session";

const BASE_URL = "exam-sessions";

export type UpdateExamProgressRequest = {
  answers: ExamSessionAnswerCreate[];
  timeSpentSeconds: number;
};

export type ExamSessionsQuery = {
  status?: string;
  userIds?: string;
  examId?: string;
  page?: number;
  pageSize?: number;
};

export type UpdateQuestionPointsRequest = {
  examSessionId: string;
  questions: UpdateQuestionPointsArgs[];
};

export type UpdateQuestionPointsArgs = {
  examSessionQuestionId: string;
  points: number;
};

const ExamSessionService = {
  get: async (id: string) => {
    const response = await api.get<ExamSession>(`${BASE_URL}/${id}`);
    return response.data;
  },
  getQuestionByQuestionId: async (
    examSessionId: string,
    questionId: string,
  ) => {
    const response = await api.get<ExamSessionQuestion>(
      `${BASE_URL}/${examSessionId}/questions/${questionId}`,
    );
    return response.data;
  },
  startExamSession: async (examId: string) => {
    const response = await api.post<ExamSession>(`${BASE_URL}/start`, {
      examId,
    });
    return response.data;
  },
  answerQuestion: async (
    examSessionId: string,
    questionId: string,
    answer: ExamSessionAnswerCreate,
  ) => {
    const response = await api.post(
      `${BASE_URL}/${examSessionId}/questions/${questionId}/answer`,
      answer,
    );

    return response.data;
  },
  updateProgress: async (
    examSessionId: string,
    request: UpdateExamProgressRequest,
  ) => {
    const payload = {
      answers: request.answers,
      timeSpentSeconds: request.timeSpentSeconds,
    };
    const response = await api.post<ExamSession>(
      `${BASE_URL}/${examSessionId}/progress`,
      payload,
    );
    return response.data;
  },
  resetAnswers: async (
    examSessionId: string,
    examSessionQuestionId: string,
  ) => {
    const response = await api.post<boolean>(
      `${BASE_URL}/${examSessionId}/questions/${examSessionQuestionId}/reset`,
    );
    return response.data;
  },
  submitExamSession: async (examSessionId: string) => {
    const response = await api.post<ExamSession>(
      `${BASE_URL}/${examSessionId}/submit`,
    );
    return response.data;
  },
  getResults: async (examSessionId: string) => {
    const response = await api.get<ExamSessionResult>(
      `${BASE_URL}/${examSessionId}/result`,
    );
    return response.data;
  },
  list: async (params: ExamSessionsQuery) => {
    const response = await api.get<PaginationResponse<ExamSessionPaginated>>(
      BASE_URL,
      {
        params: {
          status: params.status,
          userIds: params.userIds,
          examId: params.examId,
          page: params.page,
          pageSize: params.pageSize,
        },
      },
    );
    return response.data;
  },
  updateQuestionPoints: async ({
    examSessionId,
    questions,
  }: UpdateQuestionPointsRequest) => {
    const response = await api.put(
      `${BASE_URL}/${examSessionId}/result`,
      questions,
    );
    return response.data;
  },
  completeReview: async (examSessionId: string) => {
    const response = await api.post<ExamSessionResult>(
      `${BASE_URL}/${examSessionId}/complete`,
    );
    return response.data;
  },
  getPracticeOptions: async (examSessionId: string) => {
    const response = await api.get<ExamSessionPracticeOptions>(
      `${BASE_URL}/${examSessionId}/result/options`,
    );
    return response.data;
  },
  retakeExam: async (examSessionId: string, retakeOption: RetakeOptions) => {
    const response = await api.post<ExamSession>(
      `${BASE_URL}/${examSessionId}/retake`,
      {
        retakeOption,
      },
    );
    return response.data;
  },
  generateHint: async (examSessionId: string, questionId: string) => {
    const response = await api.post<{ hint: string }>(
      `${BASE_URL}/${examSessionId}/questions/${questionId}/generate-hint`,
    );
    return response.data;
  },
};

export default ExamSessionService;
