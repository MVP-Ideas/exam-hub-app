import api from "@/lib/axios";
import { Question } from "@/lib/types/questions";
import { isProblemDetails } from "@/lib/utils";
import { PaginationResponse } from "@/types/pagination";

const BASE_URL = "questions";

type SearchParams = {
  search: string;
  page: number;
  pageSize: number;
  category?: string | null;
  type?: string | null;
};

const QuestionService = {
  getQuestions: async (params: SearchParams) => {
    const response = await api.get<PaginationResponse<Question>>(BASE_URL, {
      params: {
        search: params.search,
        page: params.page,
        pageSize: params.pageSize,
        category: params.category,
        type: params.type,
      },
    });
    if (isProblemDetails(response.data)) throw response.data;
    return response.data;
  },
  getQuestion: async (id: string) => {
    const response = await api.get<Question>(`${BASE_URL}/${id}`);
    if (isProblemDetails(response.data)) throw response.data;
    return response.data;
  },
};

export default QuestionService;
