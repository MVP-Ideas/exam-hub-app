import api from "../axios";
import { ExamSession } from "../types/exam-session";

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
    const response = await api.get<ExamSession>(
      `${BASE_URL}/${examSessionId}/questions/${questionId}`,
    );
    return response.data;
  },
};

export default ExamSessionService;
