import api from "../axios";
import {
  ExamResponse,
  CreateExamRequest,
  ExamListResponse,
  ExamWithUserMetadata,
  SearchParams,
} from "../types/exam";
import { PaginationResponse } from "../types/pagination";

const BASE_URL = "exams";

const ExamService = {
  list: async (params: SearchParams) => {
    const response = await api.get<PaginationResponse<ExamResponse>>(BASE_URL, {
      params: {
        search: params.search,
        page: params.page,
        pageSize: params.pageSize,
        difficulty: params.difficulty,
        category: params.category,
        status: params.status,
        isFeatured: params.isFeatured,
      },
    });
    return response.data;
  },
  getExamsList: async () => {
    const response = await api.get<ExamListResponse[]>(`${BASE_URL}/list`);
    return response.data;
  },
  get: async (id: string, showUserStats: boolean = false) => {
    const response = await api.get<ExamWithUserMetadata>(`${BASE_URL}/${id}`, {
      params: {
        showUserStats,
      },
    });
    return response.data;
  },
  create: async (data: CreateExamRequest) => {
    const response = await api.post<ExamResponse>(BASE_URL, data);
    return response.data;
  },
  update: async (id: string, data: CreateExamRequest) => {
    const response = await api.put<ExamResponse>(`${BASE_URL}/${id}`, data);
    return response.data;
  },
  archive: async (id: string) => {
    const response = await api.post<ExamResponse>(`${BASE_URL}/${id}/archive`);
    return response.data;
  },
  feature: async (id: string) => {
    const response = await api.post<ExamResponse>(`${BASE_URL}/${id}/feature`);
    return response.data;
  },
  unfeature: async (id: string) => {
    const response = await api.post<ExamResponse>(
      `${BASE_URL}/${id}/unfeature`,
    );
    return response.data;
  },
};

export default ExamService;
