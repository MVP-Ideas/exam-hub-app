import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CreateAnswerRequest } from "../types/answer";
import { ExamSessionQuestionChoiceExplanationResponse } from "../types";

type NavigationMode = "numbers" | "questions";

interface ExamSessionState {
  // Navigation preferences
  navMode: NavigationMode;
  setNavMode: (mode: NavigationMode) => void;

  flaggedQuestions: string[];
  addFlaggedQuestion: (questionId: string) => void;
  removeFlaggedQuestion: (questionId: string) => void;

  // Any potential session progress state we might want to track
  lastVisitedExamSessionId: string | null;
  setLastVisitedExamSessionId: (examSessionId: string | null) => void;

  // Session info
  lastSavedTime: Date | null;
  setLastSavedTime: (time: Date | null) => void;

  answers: CreateAnswerRequest[];
  setAnswers: (answers: CreateAnswerRequest[]) => void;
  resetAnswers: () => void;

  clearData: () => void;

  calculatorIsOpened: boolean;
  setCalculatorIsOpened: (isOpened: boolean) => void;

  hints: { [questionId: string]: string };
  setHint: (questionId: string, hint: string) => void;
  resetHints: () => void;

  correctAnswers: {
    [questionId: string]: ExamSessionQuestionChoiceExplanationResponse[];
  };
  setCorrectAnswers: (
    questionId: string,
    answers: ExamSessionQuestionChoiceExplanationResponse[],
  ) => void;
  resetCorrectAnswers: () => void;

  showCorrectAnswers: { [questionId: string]: boolean };
  setShowCorrectAnswers: (questionId: string, show: boolean) => void;
  resetShowCorrectAnswers: (questionId: string) => void;

  questionText: {
    [questionId: string]: {
      text: string;
      overwriteStatus: "none" | "same" | "easier" | "harder";
    };
  };
  setQuestionText: (
    questionId: string,
    text: string,
    overwriteStatus: "none" | "same" | "easier" | "harder",
  ) => void;
  resetQuestionText: (questionId: string) => void;
}

export const useExamSessionStore = create<ExamSessionState>()(
  persist(
    (set) => ({
      // Default values
      navMode: "numbers",
      setNavMode: (mode) => set({ navMode: mode }),

      flaggedQuestions: [],
      addFlaggedQuestion: (questionId) =>
        set((state) => ({
          flaggedQuestions: [...state.flaggedQuestions, questionId],
        })),
      removeFlaggedQuestion: (questionId) =>
        set((state) => ({
          flaggedQuestions: state.flaggedQuestions.filter(
            (id) => id !== questionId,
          ),
        })),

      lastSavedTime: null,
      setLastSavedTime: (time) => set({ lastSavedTime: time }),

      lastVisitedExamSessionId: null,
      setLastVisitedExamSessionId: (examSessionId) =>
        set({ lastVisitedExamSessionId: examSessionId }),

      answers: [],
      setAnswers: (answers) => set({ answers }),
      resetAnswers: () => set({ answers: [] }),

      clearData: () =>
        set({
          navMode: "numbers",
          flaggedQuestions: [],
          lastSavedTime: null,
          lastVisitedExamSessionId: null,
          answers: [],
          calculatorIsOpened: undefined,
          hints: {},
          correctAnswers: {},
          showCorrectAnswers: {},
          questionText: {},
        }),

      calculatorIsOpened: false,
      setCalculatorIsOpened: (isOpened) =>
        set({ calculatorIsOpened: isOpened }),

      hints: {},
      setHint: (questionId, hint) =>
        set((state) => ({ hints: { ...state.hints, [questionId]: hint } })),
      resetHints: () => set({ hints: {} }),

      correctAnswers: {},
      setCorrectAnswers: (questionId, answers) =>
        set((state) => ({
          correctAnswers: { ...state.correctAnswers, [questionId]: answers },
        })),
      resetCorrectAnswers: () => set({ correctAnswers: {} }),

      showCorrectAnswers: {},
      setShowCorrectAnswers: (questionId, show) =>
        set((state) => ({
          showCorrectAnswers: {
            ...state.showCorrectAnswers,
            [questionId]: show,
          },
        })),
      resetShowCorrectAnswers: (questionId) =>
        set((state) => ({
          showCorrectAnswers: {
            ...state.showCorrectAnswers,
            [questionId]: false,
          },
        })),

      questionText: {},
      setQuestionText: (questionId, text, overwriteStatus) =>
        set((state) => ({
          questionText: {
            ...state.questionText,
            [questionId]: { text, overwriteStatus },
          },
        })),
      resetQuestionText: (questionId) =>
        set((state) => ({
          questionText: {
            ...state.questionText,
            [questionId]: { text: "", overwriteStatus: "none" },
          },
        })),
    }),
    {
      name: "exam-session-storage",
      // Only persist these keys
      partialize: (state) => ({
        navMode: state.navMode,
        flaggedQuestions: state.flaggedQuestions,
        lastSavedTime: state.lastSavedTime,
        lastVisitedExamSessionId: state.lastVisitedExamSessionId,
        answers: state.answers,
        calculatorIsOpened: state.calculatorIsOpened,
        hints: state.hints,
        correctAnswers: state.correctAnswers,
        showCorrectAnswers: state.showCorrectAnswers,
        questionText: state.questionText,
      }),
    },
  ),
);
