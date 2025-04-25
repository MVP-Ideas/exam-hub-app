import ExamCategoryService from "@/lib/services/exam-category-service";
import { useQuery } from "@tanstack/react-query";

const useExamCategories = (showOnlyActive: boolean = true) => {
  const { data, isLoading } = useQuery({
    queryKey: ["exam-categories"],
    queryFn: async () => ExamCategoryService.list(showOnlyActive),
  });
  return {
    categories: data,
    isLoading,
  };
};
export default useExamCategories;
