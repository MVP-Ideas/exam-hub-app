// Responses
export type AnswerChoice = {
  questionChoiceId: string;
  text?: string;
  order?: number;
};

// Requests
export type CreateAnswerChoiceRequest = {
  questionChoiceId: string;
  order?: number;
};
