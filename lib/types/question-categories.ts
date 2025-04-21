export type QuestionCategory = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
};

export type QuestionCategoryCreate = {
  name: string;
  description: string;
};
