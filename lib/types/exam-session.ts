import { Exam } from "./exam";
import { Resource } from "./resource";

export type ExamSession = {
  id: string;
  exam: Exam;
  startedAt: string;
  finishedAt: string;
  timeSpentSeconds: number;
  maxTimeSeconds: number;
  questions: ExamSessionQuestion[];
  totalScore?: number;
};

export type ExamSessionQuestion = {
  id: string;
  questionId: string;
  text: string;
  description: string;
  type: string;
  points: number;
  choices: ExamSessionQuestionChoice[];
  resources: Resource[];
  answer?: ExamSessionAnswer;
  timeSpentSeconds: number;
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
  points?: number;
  isCorrect?: boolean;
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
