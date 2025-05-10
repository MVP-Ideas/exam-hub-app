import { Resource } from "./resource";

export type ExamSession = {
  id: string;
  examId: string;
  startedAt: string;
  finishedAt: string;
  timeSpentSeconds: number;
  maxTimeSeconds: number;
  questionIds: string[];
  answers: ExamSessionAnswer[];
};

export type ExamSessionQuestion = {
  id: string;
  text: string;
  description: string;
  type: string;
  choices: ExamSessionQuestionChoice[];
  resources: Resource[];
};

export type ExamSessionQuestionChoice = {
  id: string;
  text: string;
};

export type ExamSessionAnswer = {
  id: string;
  answeredAt: string;
  aiAssitanceUsed: boolean;
  timeSpentSeconds: number;
  toBeReviewed: boolean;
  choices: ExamSessionAnswerChoice[];
};

export type ExamSessionAnswerChoice = {
  questionId: string;
  order?: number;
};
