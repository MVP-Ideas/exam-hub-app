import { Question } from "@/lib/types/questions";
import QuestionService from "@/lib/services/question-service";
import { useQuery } from "@tanstack/react-query";

const useQuestionById = (questionId: string) => {
  const { data: question, isLoading } = useQuery<Question>({
    queryKey: ["question", questionId],
    queryFn: async () => await QuestionService.get(questionId),
    select: (data) => data,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    question,
    isLoading,
  };
};

export default useQuestionById;
