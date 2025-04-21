import api from "@/lib/axios";
import { isProblemDetails } from "@/lib/utils";
import { ExamCategory } from "@/lib/types/exam-category";

const BASE_URL = "exam-categories";

const ExamCategoryService = {
  list: async (showOnlyActive: boolean) => {
    const response = await api.get<ExamCategory[]>(
      `${BASE_URL}?showOnlyActive=${showOnlyActive}`,
    );
    if (isProblemDetails(response.data)) throw response.data;
    return response.data;
  },
};

export default ExamCategoryService;
