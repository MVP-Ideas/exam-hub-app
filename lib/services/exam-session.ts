import api from "../axios";
import {
  ExamSession,
  ExamSessionAnswerCreate,
  ExamSessionQuestion,
  ExamSessionResult,
} from "../types/exam-session";

const BASE_URL = "exam-sessions";

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
  updateProgress: async (examSessionId: string, timeSpentSeconds: number) => {
    const payload = { timeSpentSeconds };
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
};

export default ExamSessionService;
