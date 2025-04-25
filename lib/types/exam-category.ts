export type ExamCategory = {
	id: string;
	name: string;
	description: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
};

export type ExamCategoryCreateUpdate = {
	name: string;
	description: string;
};