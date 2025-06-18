import ExamService from "@/lib/services/exam-service";
import { ExamList } from "@/lib/types/exam";
import { useQuery } from "@tanstack/react-query";

const useExamsList = () => {
  const {
    data: exams,
    isLoading,
    isFetching,
    isError,
  } = useQuery<ExamList[]>({
    queryKey: ["exams-list"],
    queryFn: async () => await ExamService.getExamsList(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    exams: exams || [],
    isLoading: isLoading || isFetching,
    isError,
  };
};

export default useExamsList;
