import ExamService from "@/lib/services/exam-service";
import { PaginationResponse } from "@/lib/types/pagination";
import { ExamResponse } from "@/lib/types/exam";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

type Props = {
  search?: string;
  page: number;
  pageSize: number;
  difficulty?: string | null;
  category?: string | null;
  status?: string | null;
};

const useInfiniteExams = ({
  search,
  page,
  pageSize,
  difficulty,
  category,
  status,
}: Props) => {
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    isFetching,
    isError,
  } = useInfiniteQuery<PaginationResponse<ExamResponse>>({
    queryKey: ["exams", search, pageSize, difficulty, category, status],
    queryFn: async ({ pageParam }) =>
      await ExamService.list({
        search,
        pageSize,
        page: (pageParam as number) || page,
        difficulty,
        category,
        status,
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.page > 1 ? firstPage.page - 1 : undefined,
    initialPageParam: page,
  });

  const allExams = data?.pages.flatMap((page) => page.items) ?? [];

  return {
    exams: allExams,
    isLoading,
    isFetching,
    isError,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  };
};

export default useInfiniteExams;
