import { ExamFromQuestionResponse } from "./exam";
import { QuestionCategoryResponse } from "./question-category";
import {
  CreateQuestionChoiceRequest,
  QuestionChoiceResponse,
} from "./question-choice";
import { ResourceResponse } from "./resource";

export enum QuestionType {
  MultipleChoiceSingle = "MultipleChoiceSingle",
  MultipleChoiceMultiple = "MultipleChoiceMultiple",
  TrueFalse = "TrueFalse",
  DragAndDrop = "DragAndDrop",
}

export enum QuestionSourceType {
  Text = "text",
  Link = "url",
  Base64 = "base64",
}

// Requests
export type CreateQuestionRequest = {
  choices: CreateQuestionChoiceRequest[];
  resources: string[];
  text: string;
  description: string;
  type: QuestionType;
  aiHelpEnabled: boolean;
  categoryIds: string[];
};

export type UpdateQuestionRequest = {
  choices?: CreateQuestionChoiceRequest[];
  resources?: string[];
  text?: string;
  description?: string;
  type?: QuestionType;
  aiHelpEnabled?: boolean;
  categoryIds?: string[];
};

// Responses
export type QuestionPaginatedResponse = {
  id: string;
  createdById: string;
  lastModifiedById: string;
  updatedAt: string;
  createdAt: string;
  text: string;
  description: string;
  type: QuestionType;
  categories: QuestionCategoryResponse[];
  exams: ExamFromQuestionResponse[];
};

export type QuestionResponse = {
  id: string;
  createdById: string;
  lastModifiedById: string;
  updatedAt: Date;
  createdAt: Date;
  text: string;
  description: string;
  type: QuestionType;
  isActive: boolean;
  categories: QuestionCategoryResponse[];
  choices: QuestionChoiceResponse[];
  resources: ResourceResponse[];
  exams: ExamFromQuestionResponse[];
};
