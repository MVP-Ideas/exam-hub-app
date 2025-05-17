import { Exam } from "./exam";
import { Resource } from "./resource";

export type ExamSession = {
  id: string;
  exam: Exam;
  startedAt: string;
  finishedAt: string;
  timeSpentSeconds: number;
  maxTimeSeconds: number;
  answers: ExamSessionAnswer[];
};

export type ExamSessionQuestion = {
  id: string;
  text: string;
  description: string;
  type: string;
  choices: ExamSessionQuestionChoice[];
  resources: Resource[];
  answer?: ExamSessionAnswer;
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
  questionChoiceId: string;
  order?: number;
};

export type ExamSessionAnswerCreate = {
  aiAssitanceUsed: boolean;
  timeSpentSeconds: number;
  toBeReviewed: boolean;
  choices: ExamSessionAnswerChoice[];
};
