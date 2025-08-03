import api from "@/lib/axios";
import {
  QuestionCategory,
  QuestionCategoryCreate,
  QuestionCategoryQuery,
} from "@/lib/types/question-categories";
import { isProblemDetails } from "@/lib/utils";

const BASE_URL = "question-categories";

const QuestionCategoryService = {
  create: async (data: QuestionCategoryCreate) => {
    const response = await api.post<QuestionCategory>(`${BASE_URL}`, data);
    if (isProblemDetails(response.data)) throw response.data;
    return response.data;
  },
  list: async (query?: QuestionCategoryQuery) => {
    const response = await api.get<QuestionCategory[]>(`${BASE_URL}`, {
      params: query,
    });
    if (isProblemDetails(response.data)) throw response.data;
    return response.data;
  },
};

export default QuestionCategoryService;
