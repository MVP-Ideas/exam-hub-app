import { AnswerChoice } from "./answer-choice";

// Responses
export type AnswerResponse = {
  id: string;
  answeredAt: string;
  choices: AnswerChoice[];
};

// Requests
export type CreateAnswerRequest = {
  examSessionQuestionId: string;
  timeSpentSeconds: number;
  toBeReviewed: boolean;
  choices: AnswerChoice[];
};
