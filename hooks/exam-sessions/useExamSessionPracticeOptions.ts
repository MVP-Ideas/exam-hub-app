import { useQuery } from "@tanstack/react-query";
import ExamSessionService from "@/lib/services/exam-session-service";


const useExamSessionPracticeOptions = (examSessionId: string) => {
  const {
    data: practiceOptions,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["examSessionPracticeOptions", examSessionId],
    queryFn: () => ExamSessionService.getPracticeOptions(examSessionId),
    enabled: !!examSessionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    practiceOptions,
    isLoading: isLoading || isFetching,
    isError,
  };
};

export default useExamSessionPracticeOptions;

