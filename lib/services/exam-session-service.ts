import api from "../axios";
import { PaginationResponse } from "../types/pagination";
import {
  ExamSessionPaginatedResponse,
  ExamSessionPracticeOptionsResponse,
  ExamSessionProgressRequest,
  ExamSessionResponse,
  ExamSessionResultResponse,
  ExamSessionsQuery,
  RetakeOptions,
} from "../types/exam-session";
import {
  ExamSessionQuestionResponse,
  UpdateExamSessionQuestionRequest,
} from "../types/exam-session-question";
import { CreateAnswerRequest } from "../types/answer";

const BASE_URL = "exam-sessions";

const ExamSessionService = {
  start: async (examId: string) => {
    const response = await api.post<ExamSessionResponse>(`${BASE_URL}/start`, {
      examId,
    });
    return response.data;
  },
  list: async (params: ExamSessionsQuery) => {
    const response = await api.get<
      PaginationResponse<ExamSessionPaginatedResponse>
    >(BASE_URL, {
      params: {
        status: params.status,
        userIds: params.userIds,
        examId: params.examId,
        page: params.page,
        pageSize: params.pageSize,
      },
    });
    return response.data;
  },
  get: async (id: string) => {
    const response = await api.get<ExamSessionResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },
  getResult: async (examSessionId: string) => {
    const response = await api.get<ExamSessionResultResponse>(
      `${BASE_URL}/${examSessionId}/result`,
    );
    return response.data;
  },
  getQuestionByQuestionId: async (
    examSessionId: string,
    questionId: string,
  ) => {
    const response = await api.get<ExamSessionQuestionResponse>(
      `${BASE_URL}/${examSessionId}/questions/${questionId}`,
    );
    return response.data;
  },
  answerQuestion: async (
    examSessionId: string,
    questionId: string,
    answer: CreateAnswerRequest,
  ) => {
    const response = await api.post<ExamSessionQuestionResponse>(
      `${BASE_URL}/${examSessionId}/questions/${questionId}/answer`,
      answer,
    );

    return response.data;
  },
  resetAnswer: async (examSessionId: string, examSessionQuestionId: string) => {
    const response = await api.post<boolean>(
      `${BASE_URL}/${examSessionId}/questions/${examSessionQuestionId}/reset`,
    );
    return response.data;
  },
  updateProgress: async (
    examSessionId: string,
    request: ExamSessionProgressRequest,
  ) => {
    const payload = {
      answers: request.answers,
      timeSpentSeconds: request.timeSpentSeconds,
    };
    const response = await api.post<ExamSessionResponse>(
      `${BASE_URL}/${examSessionId}/progress`,
      payload,
    );
    return response.data;
  },
  submit: async (examSessionId: string) => {
    const response = await api.post<ExamSessionResponse>(
      `${BASE_URL}/${examSessionId}/submit`,
    );
    return response.data;
  },
  update: async ({
    examSessionId,
    questions,
  }: {
    examSessionId: string;
    questions: UpdateExamSessionQuestionRequest[];
  }) => {
    const response = await api.put(
      `${BASE_URL}/${examSessionId}/result`,
      questions,
    );
    return response.data;
  },
  completeReview: async (examSessionId: string) => {
    const response = await api.post<ExamSessionResultResponse>(
      `${BASE_URL}/${examSessionId}/complete`,
    );
    return response.data;
  },
  getPracticeOptions: async (examSessionId: string) => {
    const response = await api.get<ExamSessionPracticeOptionsResponse>(
      `${BASE_URL}/${examSessionId}/result/options`,
    );
    return response.data;
  },
  retakeExam: async (examSessionId: string, retakeOption: RetakeOptions) => {
    const response = await api.post<ExamSessionResponse>(
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
