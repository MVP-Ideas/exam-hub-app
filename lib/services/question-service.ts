import api from "@/lib/axios";
import {
  CreateQuestionRequest,
  QuestionResponse,
  UpdateQuestionRequest,
} from "@/lib/types/questions";
import { PaginationResponse } from "@/lib/types/pagination";
import {
  GenerateQuestionsRequest,
  GeneratedQuestionResponse,
  GenerateExplanationRequest,
  GenerateExplanationResponse,
} from "../types/functions-ai";

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
    const response = await api.get<PaginationResponse<QuestionResponse>>(
      BASE_URL,
      {
        params: {
          search: params.search,
          page: params.page,
          pageSize: params.pageSize,
          category: params.category,
          type: params.type,
        },
      },
    );

    return response.data;
  },
  get: async (id: string) => {
    const response = await api.get<QuestionResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },
  create: async (data: CreateQuestionRequest) => {
    const response = await api.post<QuestionResponse>(BASE_URL, data);
    return response.data;
  },
  update: async (id: string, data: UpdateQuestionRequest) => {
    const response = await api.put<QuestionResponse>(`${BASE_URL}/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<QuestionResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },
  generateQuestions: async (data: GenerateQuestionsRequest) => {
    const response = await api.post<GeneratedQuestionResponse[]>(
      `${BASE_URL}/generate`,
      data,
    );
    return response.data;
  },
  generateExplanation: async (data: GenerateExplanationRequest) => {
    const response = await api.post<GenerateExplanationResponse>(
      `${BASE_URL}/generate-explanation`,
      data,
    );
    return response.data;
  },
};

export default QuestionService;
