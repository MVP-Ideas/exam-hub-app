import ExamCategoryService from "@/lib/services/exam-category-service";
import { ExamCategory } from "@/lib/types/exam-category";
import { useQuery } from "@tanstack/react-query";

const useExamCategories = (showOnlyActive: boolean) => {
  const { data: categories, isLoading } = useQuery<ExamCategory[]>({
    queryKey: ["exam-categories", showOnlyActive],
    queryFn: async () => await ExamCategoryService.list(showOnlyActive),
  });

  return {
    categories,
    isLoading,
  };
};

export default useExamCategories;
