export type Exam = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  durationSeconds: number;
  passingScore: number;
  resources: string[];
  status: string;
  questions: ExamQuestionCreateReadUpdate[];
  settings: ExamSettingsCreateReadUpdate;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export type ExamCreateUpdate = {
  title: string;
  description: string;
  categoryId: string;
  difficulty: string;
  durationSeconds: number;
  passingScore: number;
  resourceIds: string[];
  isDraft: boolean;
  questions: ExamQuestionCreateReadUpdate[];
  settings: ExamSettingsCreateReadUpdate;
};

export type ExamSettingsCreateReadUpdate = {
  timeLimitEnabled: boolean;
  resultsImmediately: boolean;
  randomizeQuestions: boolean;
};

export type ExamQuestionCreateReadUpdate = {
  questionId: string;
  points: number;
};
