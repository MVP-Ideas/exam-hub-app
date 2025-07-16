import { QuestionSourceType, QuestionType } from "./questions";

export type GenerateQuestionsRequest = {
  sourceType: QuestionSourceType;
  content: string;
  questionCount: number;
  allowedQuestionType: QuestionType;
};

export type GeneratedQuestionResponse = {
  text: string;
  type: QuestionType;
  choices: GeneratedQuestionChoiceResponse[];
};

export type GeneratedQuestionChoiceResponse = {
  text: string;
  isCorrect: boolean;
  order?: number;
};

export type GenerateExplanationRequest = {
  question: string;
  type: QuestionType;
  answers: GenerateExplainationAnswerRequest[];
};

export type GenerateExplainationAnswerRequest = {
  text: string;
  isCorrect?: boolean;
  order?: number;
};

export type GenerateExplanationResponse = {
  overallExplanation: string;
  answers: GenerateExplanationAnswerResponse[];
};

export type GenerateExplanationAnswerResponse = {
  text: string;
  explanation: string;
};
