import api from "@/lib/axios";
import { isProblemDetails } from "@/lib/utils";
import {
  ExamCategoryResponse,
  CreateExamCategoryRequest,
} from "@/lib/types/exam-category";

const BASE_URL = "exam-categories";

const ExamCategoryService = {
  create: async (data: CreateExamCategoryRequest) => {
    const response = await api.post<ExamCategoryResponse>(BASE_URL, data);
    if (isProblemDetails(response.data)) throw response.data;
    return response.data;
  },
  list: async (showOnlyActive: boolean) => {
    const response = await api.get<ExamCategoryResponse[]>(
      `${BASE_URL}?showOnlyActive=${showOnlyActive}`,
    );
    if (isProblemDetails(response.data)) throw response.data;
    return response.data;
  },
};

export default ExamCategoryService;
