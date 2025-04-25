import { Question } from "@/lib/types/questions";
import QuestionService from "@/lib/services/question-service";
import { useQuery } from "@tanstack/react-query";

const useQuestionById = (questionId: string, enabled: boolean = true) => {
  const {
    data: question,
    isLoading,
    isError,
  } = useQuery<Question>({
    queryKey: ["question", questionId],
    queryFn: async () => await QuestionService.get(questionId),
    select: (data) => data,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: enabled && !!questionId,
  });

  return {
    question,
    isLoading,
    isError,
  };
};

export default useQuestionById;
