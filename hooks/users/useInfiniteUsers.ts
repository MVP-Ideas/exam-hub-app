import UserService from "@/lib/services/user-service";
import { PaginationResponse } from "@/lib/types/pagination";
import { User } from "@/lib/types/user";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

type Props = {
  search?: string;
  page: number;
  pageSize: number;
  role: string;
};

const useInfiniteUsers = ({ search, page, pageSize, role }: Props) => {
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    isFetching,
    isError,
  } = useInfiniteQuery<PaginationResponse<User>>({
    queryKey: ["infiniteLearners", search, pageSize, role],
    queryFn: async ({ pageParam }) =>
      await UserService.getUsers({
        search: search || "",
        pageSize,
        page: (pageParam as number) || page,
        role,
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.page > 1 ? firstPage.page - 1 : undefined,
    initialPageParam: page,
  });

  const allUsers = data?.pages.flatMap((page) => page.items) ?? [];
  const totalItems = data?.pages[0]?.totalItems ?? 0;

  return {
    users: allUsers,
    totalItems,
    isLoading,
    isFetching,
    isError,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  };
};

export default useInfiniteUsers;
