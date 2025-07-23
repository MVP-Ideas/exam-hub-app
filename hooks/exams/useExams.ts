import ExamService from "@/lib/services/exam-service";
import { ExamResponse } from "@/lib/types/exam";
import { PaginationResponse } from "@/lib/types/pagination";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

type Props = {
  search: string;
  page: number;
  pageSize: number;
  difficulty: string;
  status: string;
  isFeatured?: boolean;
};

const useGetExams = (params: Props) => {
  const {
    data: exams,
    isLoading,
    isFetching,
    isError,
  } = useQuery<PaginationResponse<ExamResponse>>({
    queryKey: ["exams", params],
    queryFn: async () => await ExamService.list(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const emptyResponse: PaginationResponse<ExamResponse> = {
    items: [],
    page: params.page,
    pageSize: params.pageSize,
    totalItems: 0,
    totalPages: 0,
  };

  return {
    exams: exams ? exams : emptyResponse,
    isLoading: isLoading || isFetching,
    isError,
  };
};

export default useGetExams;
