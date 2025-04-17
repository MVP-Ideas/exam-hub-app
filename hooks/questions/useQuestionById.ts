import { Question } from "@/lib/types/questions";
import QuestionService from "@/services/question-service";
import { useQuery } from "@tanstack/react-query";

const useQuestionById = (questionId: string) => {
  const { data: question, isLoading } = useQuery<Question>({
    queryKey: ["question", questionId],
    queryFn: async () => await QuestionService.getQuestion(questionId),
    select: (data) => data,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    question,
    isLoading,
  };
};

export default useQuestionById;
