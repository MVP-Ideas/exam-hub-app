// Requests
export type UpsertExamSettingsRequest = {
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
  enableViewAnswer: boolean;
};

// Responses
export type ExamSettingsResponse = {
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
  enableViewAnswer: boolean;
};
