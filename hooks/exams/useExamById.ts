import ExamService from "@/lib/services/exam-service";
import { useQuery } from "@tanstack/react-query";

const useExamById = (examId: string, showUserStats: boolean = true) => {
  const {
    data: exam,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["exam", examId],
    queryFn: async () => await ExamService.get(examId, showUserStats),
    select: (data) => data,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!examId,
  });

  return {
    exam,
    isLoading,
    isError,
  };
};
export default useExamById;
