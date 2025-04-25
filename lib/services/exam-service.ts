import api from "../axios";
import { Exam, ExamCreateUpdate } from "../types/exam";
import { PaginationResponse } from "../types/pagination";

const BASE_URL = "exams";

type SearchParams = {
  search: string;
  page: number;
  pageSize: number;
  difficulty?: string | null;
  category?: string | null;
  status?: string | null;
};

const ExamService = {
  list: async (params: SearchParams) => {
    const response = await api.get<PaginationResponse<Exam>>(BASE_URL, {
      params: {
        search: params.search,
        page: params.page,
        pageSize: params.pageSize,
        difficulty: params.difficulty,
        category: params.category,
        status: params.status,
      },
    });
    return response.data;
  },
  get: async (id: string) => {
    const response = await api.get<Exam>(`${BASE_URL}/${id}`);
    return response.data;
  },
  create: async (data: ExamCreateUpdate) => {
    const response = await api.post<Exam>(BASE_URL, data);
    return response.data;
  },
  update: async (id: string, data: ExamCreateUpdate) => {
    const response = await api.put<Exam>(`${BASE_URL}/${id}`, data);
    return response.data;
  },
  archive: async (id: string) => {
    const response = await api.post<Exam>(`${BASE_URL}/${id}/archive`);
    return response.data;
  },
};

export default ExamService;
