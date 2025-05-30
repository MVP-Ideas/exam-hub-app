import { useQuery } from "@tanstack/react-query";
import ExamSessionService from "@/lib/services/exam-session";

const useExamSessionResult = (examSessionId: string) => {
  const {
    data: examSessionResult,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["examSessionResult", examSessionId],
    queryFn: () => ExamSessionService.getResults(examSessionId),
    enabled: !!examSessionId,
  });

  return {
    examSessionResult,
    isLoading,
    isError,
  };
};

export default useExamSessionResult;
