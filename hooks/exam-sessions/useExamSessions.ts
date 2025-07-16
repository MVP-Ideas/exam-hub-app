import ExamSessionService from "@/lib/services/exam-session-service";
import { ExamSessionPaginatedResponse } from "@/lib/types/exam-session";
import { PaginationResponse } from "@/lib/types/pagination";
import { useQuery } from "@tanstack/react-query";

type Props = {
  status?: string;
  userIds?: string[];
  examId?: string;
  page?: number;
  pageSize?: number;
};

const useExamSessions = ({
  status,
  userIds,
  examId,
  page = 1,
  pageSize = 10,
}: Props = {}) => {
  // Convert array of userIds to comma-separated string if provided
  const userIdsString = userIds?.join(",");

  const {
    data: examSessions,
    isLoading,
    isFetching,
    isError,
  } = useQuery<PaginationResponse<ExamSessionPaginatedResponse>>({
    queryKey: ["examSessions", status, userIdsString, examId, page, pageSize],
    queryFn: async () =>
      await ExamSessionService.list({
        status,
        userIds: userIdsString,
        examId,
        page,
        pageSize,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    examSessions: examSessions || [],
    isLoading,
    isFetching,
    isError,
  };
};

export default useExamSessions;
