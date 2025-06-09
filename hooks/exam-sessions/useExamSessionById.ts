import ExamSessionService from "@/lib/services/exam-session";
import { useQuery } from "@tanstack/react-query";

const useExamSessionById = (examSessionId: string) => {
  const {
    data: examSession,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["examSession", examSessionId],
    queryFn: async () => await ExamSessionService.get(examSessionId),
    select: (data) => data,
    enabled: !!examSessionId,
    staleTime: 0,
  });

  return {
    examSession,
    isLoading,
    isError,
  };
};
export default useExamSessionById;
