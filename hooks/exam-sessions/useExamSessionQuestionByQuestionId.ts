import ExamSessionService from "@/lib/services/exam-session";
import { useQuery } from "@tanstack/react-query";

const useExamSessionQuestionByQuestionId = (
  examSessionId: string,
  questionId: string,
) => {
  const {
    data: question,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["examSessionQuestion", examSessionId, questionId],
    queryFn: async () =>
      await ExamSessionService.getQuestionByQuestionId(
        examSessionId,
        questionId,
      ),
    select: (data) => data,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!examSessionId && !!questionId,
  });

  return {
    question,
    isLoading,
    isError,
  };
};
export default useExamSessionQuestionByQuestionId;
