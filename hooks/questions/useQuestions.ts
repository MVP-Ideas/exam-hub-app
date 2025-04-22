"use client";

import QuestionService from "@/lib/services/question-service";
import { PaginationResponse } from "@/lib/types/pagination";
import { Question } from "@/lib/types/questions";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

type Props = {
  search: string;
  page: number;
  pageSize: number;
  type?: string | null;
  category?: string | null;
};

const useGetQuestions = (params: Props) => {
  const {
    data: questions,
    isLoading,
    isFetching,
    isError,
  } = useQuery<PaginationResponse<Question>>({
    queryKey: ["questions", JSON.stringify(params)],
    queryFn: async () => await QuestionService.list(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
  });

  const emptyResponse: PaginationResponse<Question> = {
    items: [],
    page: params.page,
    pageSize: params.pageSize,
    totalItems: 0,
    totalPages: 0,
  };

  return {
    questions: !isError ? questions : emptyResponse,
    isLoading: isLoading || isFetching,
    isError,
  };
};

export default useGetQuestions;
