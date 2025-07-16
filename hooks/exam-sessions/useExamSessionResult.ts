import { useQuery } from "@tanstack/react-query";
import ExamSessionService from "@/lib/services/exam-session-service";

const useExamSessionResult = (examSessionId: string) => {
  const {
    data: examSessionResult,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["examSessionResult", examSessionId],
    queryFn: () => ExamSessionService.getResult(examSessionId),
    enabled: !!examSessionId,
  });

  return {
    examSessionResult,
    isLoading: isLoading || isFetching,
    isError,
  };
};

export default useExamSessionResult;
