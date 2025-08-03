// Query
export type QuestionCategoryQuery = {
  search?: string;
};

export type QuestionCategory = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  usageCount: number;
};

export type QuestionCategoryCreate = {
  name: string;
  description: string;
};

export type QuestionCategoryQuestionResponse = {
  id: string;
  name: string;
};