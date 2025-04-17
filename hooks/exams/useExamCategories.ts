import ExamCategoryService from '@/services/exam-category-service';
import { ExamCategory } from '@/types/exam-category';
import { useQuery } from '@tanstack/react-query';

const useExamCategories = (showOnlyActive: boolean) => {
	const { data: categories, isLoading } = useQuery<ExamCategory[]>({
		queryKey: ['exam-categories', showOnlyActive],
		queryFn: async () => await ExamCategoryService.getAll(showOnlyActive),
	});

	return {
		categories,
		isLoading,
	};
};

export default useExamCategories;
