import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ExamSessionAnswerCreate } from "../types/exam-session";

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

  answers: ExamSessionAnswerCreate[];
  setAnswers: (answers: ExamSessionAnswerCreate[]) => void;
  resetAnswers: () => void;

  clearData: () => void;

  calculatorIsOpened: boolean;
  setCalculatorIsOpened: (isOpened: boolean) => void;
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

      clearData: () => set({
        navMode: "numbers",
        flaggedQuestions: [],
        lastSavedTime: null,
        lastVisitedExamSessionId: null,
        answers: [],
        calculatorIsOpened: undefined,
      }),

      calculatorIsOpened: false,
      setCalculatorIsOpened: (isOpened) =>
        set({ calculatorIsOpened: isOpened }),
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
      }),
    },
  ),
);
