"use client";

import QuestionService from "@/services/question-service";
import { PaginationResponse } from "@/types/pagination";
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
  } = useQuery<PaginationResponse<Question>>({
    queryKey: ["questions", params],
    queryFn: async () => await QuestionService.getQuestions(params),
    select: (data) => data,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    questions,
    isLoading: isLoading || isFetching,
  };
};

export default useGetQuestions;
