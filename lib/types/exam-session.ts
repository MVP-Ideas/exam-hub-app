import { Exam, ExamSettingsCreateReadUpdate } from "./exam";
import { QuestionChoice } from "./questions";
import { Resource } from "./resource";

export type ExamSession = {
  id: string;
  exam: Exam;
  startedAt: string;
  finishedAt: string;
  timeSpentSeconds?: number;
  maxTimeSeconds: number;
  questions: ExamSessionQuestion[];
  totalScore?: number;
  settings: ExamSettingsCreateReadUpdate;
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
  text?: string;
  order?: number;
};

export type ExamSessionAnswerCreate = {
  examSessionQuestionId: string;
  aiAssitanceUsed: boolean;
  timeSpentSeconds: number;
  toBeReviewed: boolean;
  choices: ExamSessionAnswerChoice[];
};

export type ExamSessionQuestionResultResponse = {
  id: string;
  text?: string;
  type: string;
  explanation: string;
  answer?: ExamSessionAnswer;
  correctChoices: QuestionChoice[];
};

export type ExamSessionResult = {
  id: string;
  examTitle: string;
  examId: string;
  score: number;
  totalScore: number;
  finishedAt: string;
  timeSpentSeconds: number;
  passingScore: number;
  passingFlag: string;
  questions: ExamSessionQuestionResultResponse[];
};
