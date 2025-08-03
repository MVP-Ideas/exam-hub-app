// Requests
export type CreateQuestionChoiceRequest = {
  text: string;
  isCorrect: boolean;
  explanation?: string;
};

// Responses
export type QuestionChoiceResponse = {
  id: string;
  text: string;
  order?: number;
  explanation?: string;
};

export type QuestionChoiceResultResponse = {
  id: string;
  text: string;
  isCorrect: boolean;
  order?: number;
  explanation: string;
};
