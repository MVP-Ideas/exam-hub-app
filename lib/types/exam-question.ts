import {
  QuestionChoiceResponse,
  QuestionChoiceResultResponse,
} from "./question-choice";
import { ResourceResponse } from "./resource";

// Requests
export type UpsertExamQuestionRequest = {
  questionId: string;
  points: number;
};

// Responses
export type ExamQuestionExamResponse = {
  questionId: string;
  points: number;
};

export type ExamQuestionExamSessionQuestionResponse = {
  id: string;
  text: string;
  type: string;
  description: string;
  points: number;
  choices: QuestionChoiceResponse[];
  resources: ResourceResponse[];
};

export type ExamQuestionExamSessionQuestionResultResponse = {
  id: string;
  text: string;
  type: string;
  description: string;
  points: number;
  choices: QuestionChoiceResultResponse[];
};

export type ExamQuestionExamSessionResponse = {
  questionId: string;
  text: string;
  points: number;
};
