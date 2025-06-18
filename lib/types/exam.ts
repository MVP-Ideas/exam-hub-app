import { ExamCategory } from "./exam-category";
import { Resource } from "./resource";

export type Exam = {
  id: string;
  title: string;
  description: string;
  categories: ExamCategory[];
  difficulty: string;
  durationSeconds: number;
  passingScore: number;
  resources: Resource[];
  status: string;
  questions: ExamQuestionCreateReadUpdate[];
  settings: ExamSettingsCreateReadUpdate;
  createdAt: string;
  updatedAt: string;
  version: number;
  isFeatured: boolean;
};

export type ExamCreateUpdate = {
  title: string;
  description: string;
  categoryIds: string[];
  difficulty: string;
  durationSeconds?: number;
  passingScore: number;
  resourceIds: string[];
  isDraft: boolean;
  questions: ExamQuestionCreateReadUpdate[];
  settings: ExamSettingsCreateReadUpdate;
};

export type ExamSettingsCreateReadUpdate = {
  resultsImmediately: boolean;
  randomizeQuestions: boolean;
  showCalculator: boolean;
  showExamResourcesDuringSession: boolean;
  showQuestionResourcesDuringSession: boolean;
  showQuestionPoints: boolean;
  showQuestionExplanations: boolean;
  enableAiPoweredExplanations: boolean;
  enableAiRewriteQuestions: boolean;
  enableHints: boolean;
};

export type ExamQuestionCreateReadUpdate = {
  questionId: string;
  text?: string;
  points: number;
};

export type ExamExistingSession = {
  existingExamSessionId: string;
  lastUpdated: string;
};

export type ExamPreviousSession = {
  examSessionId: string;
  finishedAt: string;
  scorePercentage: number;
  passingFlag: string;
  status: string;
};

export type ExamWithUserMetadata = Exam & {
  existingOngoingSession: ExamExistingSession;
  previousSessions: ExamPreviousSession[];
};

export type ExamList = {
  id: string;
  title: string;
};