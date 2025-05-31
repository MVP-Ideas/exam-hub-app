import { QuestionCategoryQuestionResponse } from "./question-categories";
import { Resource } from "./resource";

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
  categories: QuestionCategoryQuestionResponse[];
  isActive: boolean;
  choices: QuestionChoice[];
  resources: Resource[];
  aiHelpEnabled: boolean;
  exams: QuestionExam[];
};

export type QuestionChoice = {
  id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
  order: number | null;
};

export type QuestionCreateUpdate = {
  text: string;
  description: string;
  choices: QuestionChoiceCreateUpdate[];
  resources: string[];
  type: QuestionType;
  categoryIds: string[];
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

// For getting the exams that uses the question
export type QuestionExam = {
  id: string;
  createdAt: Date;
  title: string;
  status: "Draft" | "Published" | "Archived";
};
