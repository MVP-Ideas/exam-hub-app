// Responses
export type ExamCategoryResponse = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ExamCategoryExamResponse = {
  id: string;
  name: string;
};

// Requests
export type CreateExamCategoryRequest = {
  name: string;
  description: string;
};