import ExamSessionService from "@/lib/services/exam-session-service";
import { ExamSessionPaginatedResponse } from "@/lib/types/exam-session";
import { PaginationResponse } from "@/lib/types/pagination";
import { useInfiniteQuery } from "@tanstack/react-query";

type Props = {
  status?: string;
  userIds?: string[];
  examId?: string;
  pageSize?: number;
  page?: number;
};

const useInfiniteExamSessions = ({
  status,
  userIds,
  examId,
  pageSize,
  page,
}: Props = {}) => {
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    isFetching,
    isError,
  } = useInfiniteQuery<PaginationResponse<ExamSessionPaginatedResponse>>({
    queryKey: ["examSessions", status, userIds, examId, pageSize],
    queryFn: async ({ pageParam }) => {
      // Convert array of userIds to comma-separated string
      const userIdsString = userIds?.join(",");

      return await ExamSessionService.list({
        status,
        userIds: userIdsString,
        examId,
        page: (pageParam as number) || page || 1,
        pageSize,
      });
    },
    staleTime: 1000 * 60 * 5, // Reduced stale time to 5 minutes
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.page > 1 ? firstPage.page - 1 : undefined,
    initialPageParam: 1,
  });

  // Flatten all pages into a single array
  const allExamSessions = data?.pages.flatMap((page) => page.items) ?? [];

  return {
    examSessions: allExamSessions,
    isLoading,
    isFetching,
    isError,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  };
};

export default useInfiniteExamSessions;
