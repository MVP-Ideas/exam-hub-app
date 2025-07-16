import QuestionService from "@/lib/services/question-service";
import { PaginationResponse } from "@/lib/types/pagination";
import { QuestionResponse } from "@/lib/types/questions";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

type Props = {
  search: string;
  page: number;
  pageSize: number;
  type?: string | null;
  category?: string | null;
};

const useInfiniteQuestions = ({
  search,
  page,
  pageSize,
  type,
  category,
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
  } = useInfiniteQuery<PaginationResponse<QuestionResponse>>({
    queryKey: ["questions", search, pageSize, type, category],
    queryFn: async ({ pageParam }) =>
      await QuestionService.list({
        search,
        pageSize,
        page: (pageParam as number) || page,
        type,
        category,
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.page > 1 ? firstPage.page - 1 : undefined,
    initialPageParam: page,
  });

  const allQuestions = data?.pages.flatMap((page) => page.items) ?? [];

  return {
    questions: allQuestions,
    isLoading: isLoading,
    isFetching: isFetching,
    isError,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  };
};

export default useInfiniteQuestions;
