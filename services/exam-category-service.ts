import api from '@/lib/axios';
import { isProblemDetails } from '@/lib/utils';
import { ExamCategory } from '@/types/exam-category';

const BASE_URL = 'exam-categories';

const ExamCategoryService = {
	getAll: async (showOnlyActive: boolean) => {
		const response = await api.get<ExamCategory[]>(
			`${BASE_URL}?showOnlyActive=${showOnlyActive}`
		);
		if (isProblemDetails(response.data)) throw response.data;
		return response.data;
	},
};

export default ExamCategoryService;
