export enum QuestionType {
  MultipleChoiceSingle = "MultipleChoiceSingle",
  MultipleChoiceMultiple = "MultipleChoiceMultiple",
  TrueFalse = "TrueFalse",
  DragAndDrop = "DragAndDrop",
}

export type Question = {
  id: string;
  createdById: string;
  lastModifiedById: string;
  updatedAt: Date;
  createdAt: Date;
  text: string;
  description: string;
  type: QuestionType;
  category: string | null;
  isActive: boolean;
  choices: QuestionChoice[];
  resources: QuestionResource[];
  aiHelpEnabled: boolean;
};

export type QuestionChoice = {
  id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
  order: number | null;
};

export type QuestionResource = {
  id?: string;
  type: string;
  value: string;
  description: string;
};

export type QuestionCreateUpdate = {
  text: string;
  description: string;
  choices: QuestionChoiceCreateUpdate[];
  resources: string[];
  type: QuestionType;
  categoryId: string | null;
  aiHelpEnabled: boolean;
};

export type QuestionChoiceCreateUpdate = {
  text: string;
  isCorrect: boolean;
};

export interface ExamQuestion {
  order: number;
  question: string;
  choices: QuestionChoice[];
  type: QuestionType;
  isAnswered: boolean;
  reviewLater: boolean;
  leaveFeedback: boolean;
}
