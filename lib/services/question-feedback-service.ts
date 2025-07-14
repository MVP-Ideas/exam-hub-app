import api from "../axios";
import { CreateQuestionFeedbackRequest } from "../types/question-feedback";

const BASE_URL = "question-feedback";

const QuestionFeedbackService = {
  create: async (data: CreateQuestionFeedbackRequest) => {
    const response = await api.post<boolean>(BASE_URL, data);
    return response.data;
  },
};

export default QuestionFeedbackService;
