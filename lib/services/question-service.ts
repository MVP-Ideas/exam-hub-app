import api from "@/lib/axios";
import { Question, QuestionCreateUpdate } from "@/lib/types/questions";

import { PaginationResponse } from "@/lib/types/pagination";
import { QuestionCreateUpdate } from "../types/questions";

const BASE_URL = "questions";

type SearchParams = {
  search: string;
  page: number;
  pageSize: number;
  category?: string | null;
  type?: string | null;
};

const QuestionService = {
  list: async (params: SearchParams) => {
    const response = await api.get<PaginationResponse<Question>>(BASE_URL, {
      params: {
        search: params.search,
        page: params.page,
        pageSize: params.pageSize,
        category: params.category,
        type: params.type,
      },
    });

    return response.data;
  },
  get: async (id: string) => {
    const response = await api.get<Question>(`${BASE_URL}/${id}`);
    return response.data;
  },
  create: async (data: QuestionCreateUpdate) => {
    const response = await api.post<Question>(BASE_URL, data);
    return response.data;
  },
  update: async (id: string, data: QuestionCreateUpdate) => {
    const response = await api.put<Question>(`${BASE_URL}/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<Question>(`${BASE_URL}/${id}`);
    return response.data;
  },
};

export default QuestionService;
