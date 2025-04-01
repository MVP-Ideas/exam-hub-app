export enum QuestionType {
	MultipleChoice = 'MultipleChoice',
	MultipleAnswer = 'MultipleAnswer',
}

export interface QuestionChoice {
	order: number;
	choice: string;
	isCorrect: boolean;
	isSelected: boolean;
}

export interface Question {
	order: number;
	question: string;
	choices: QuestionChoice[];
	type: QuestionType;
	isAnswered: boolean;
    reviewLater: boolean;
    leaveFeedback: boolean;
}
