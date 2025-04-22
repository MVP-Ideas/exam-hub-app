import QuestionCategoryService from "@/lib/services/question-category-service";
import { useQuery } from "@tanstack/react-query";

const useQuestionCategories = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["question-categories"],
    queryFn: async () => QuestionCategoryService.list(),
  });
  return {
    categories: data,
    isLoading,
  };
};
export default useQuestionCategories;
