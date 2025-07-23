import { AnswerResponse } from "./answer";
import {
  ExamQuestionExamSessionQuestionResponse,
  ExamQuestionExamSessionQuestionResultResponse,
} from "./exam-question";

// Query
export type RewriteDifficulty = "same" | "easier" | "harder";

// Requests
export type UpdateExamSessionQuestionRequest = {
  examSessionQuestionId: string;
  points: number;
};

// Responses
export type ExamSessionQuestionResponse = {
  id: string;
  question: ExamQuestionExamSessionQuestionResponse;
  aiAssistanceUsed: boolean;
  timeSpentSeconds: number;
  points: number;
  isCorrect: boolean;
  answer?: AnswerResponse;
};

export type ExamSessionQuestionResultResponse = {
  id: string;
  question: ExamQuestionExamSessionQuestionResultResponse;
  points: number;
  isCorrect: boolean;
  aiAssistanceUsed: boolean;
  timeSpentSeconds: number;
  toBeReviewed: boolean;
  answer?: AnswerResponse;
};

export type ExamSessionQuestionChoiceExplanationResponse = {
  questionChoiceId: string;
  explanation: string;
  order?: number;
};

export type ExamSessionQuestionRewriteResponse = {
  text: string;
};
