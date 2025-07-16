"use client";

import UserService from "@/lib/services/user-service";
import { PaginationResponse } from "@/lib/types/pagination";
import { UserResponse } from "@/lib/types/user";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

type Props = {
  search: string;
  page: number;
  pageSize: number;
  role: string;
};

const useGetUsers = (params: Props) => {
  const {
    data: learners,
    isLoading,
    isFetching,
    isError,
  } = useQuery<PaginationResponse<UserResponse>>({
    queryKey: ["users", params],
    queryFn: async () => await UserService.getUsers(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const emptyResponse: PaginationResponse<UserResponse> = {
    items: [],
    page: params.page,
    pageSize: params.pageSize,
    totalItems: 0,
    totalPages: 0,
  };

  return {
    learners: learners ? learners : emptyResponse,
    isLoading: isLoading || isFetching,
    isError,
  };
};

export default useGetUsers;
