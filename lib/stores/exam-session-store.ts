import { create } from "zustand";
import { persist } from "zustand/middleware";

type NavigationMode = "numbers" | "questions";

interface ExamSessionState {
  // Navigation preferences
  navMode: NavigationMode;
  setNavMode: (mode: NavigationMode) => void;

  flaggedQuestions: string[];
  addFlaggedQuestion: (questionId: string) => void;
  removeFlaggedQuestion: (questionId: string) => void;

  // Any potential session progress state we might want to track
  lastVisitedExamId: string | null;
  setLastVisitedExamId: (examId: string | null) => void;

  // Session info
  examSessionProgress: Record<string, number>; // examSessionId -> progress
  updateExamSessionProgress: (sessionId: string, progress: number) => void;
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

      lastVisitedExamId: null,
      setLastVisitedExamId: (examId) => set({ lastVisitedExamId: examId }),

      examSessionProgress: {},
      updateExamSessionProgress: (sessionId, progress) =>
        set((state) => ({
          examSessionProgress: {
            ...state.examSessionProgress,
            [sessionId]: progress,
          },
        })),
    }),
    {
      name: "exam-session-storage",
      // Only persist these keys
      partialize: (state) => ({
        navMode: state.navMode,
        flaggedQuestions: state.flaggedQuestions,
        lastVisitedExamId: state.lastVisitedExamId,
        examSessionProgress: state.examSessionProgress,
      }),
    },
  ),
);
