import QuestionCategoryService from "@/lib/services/question-category-service";
import { QuestionCategoryQuery } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

const useQuestionCategories = (query?: QuestionCategoryQuery) => {
  const { data, isLoading } = useQuery({
    queryKey: ["question-categories"],
    queryFn: async () => QuestionCategoryService.list(query),
  });
  return {
    categories: data,
    isLoading,
  };
};
export default useQuestionCategories;
