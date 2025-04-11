'use client';

import UserService from '@/services/user-service';
import { PaginationResponse } from '@/types/pagination';
import { User } from '@/types/user';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

type Props = {
	search: string;
	page: number;
	pageSize: number;
	role: string;
};

const useGetLearners = (params: Props) => {
	const {
		data: learners,
		isLoading,
		isFetching,
	} = useQuery<PaginationResponse<User>>({
		queryKey: ['learners', params],
		queryFn: async () => await UserService.getLearners(params),
		select: (data) => data,
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

	return {
		learners: learners,
		isLoading: isLoading || isFetching,
	};
};

export default useGetLearners;
