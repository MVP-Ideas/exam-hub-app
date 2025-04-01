import { questionsList } from "@/lib/constants";
import { Question } from "@/lib/types";
import { create } from "zustand";

type QuestionStore = {
  timer: number;
  isOnBreak: boolean;
  questions: Question[];
  intervalId: NodeJS.Timeout | null;

  setTimer: (time: number) => void;
  setQuestions: (questions: Question[]) => void;
  resetQuestions: () => void;

  startTimer: () => void;
  stopTimer: () => void;
  startBreak: () => void;
  stopBreak: () => void;

  updateQuestion: (order: number, question: Question) => void;
  getAnsweredQuestions: () => Question[];
};


const loadLocalState = <T>(key: string, defaultValue: T): T => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  }
  return defaultValue;
};

export const useQuestionStore = create<QuestionStore>((set, get) => ({
  timer: loadLocalState("timer", 6000),
  isOnBreak: loadLocalState("isOnBreak", false),
  questions: loadLocalState("questions", questionsList),
  intervalId: null,

  setTimer: (time) => {
    set({ timer: time });
    localStorage.setItem("timer", JSON.stringify(time));
  },

  setQuestions: (questions) => {
    set({ questions });
    localStorage.setItem("questions", JSON.stringify(questions));
  },

  resetQuestions: () => {
    set({ questions: questionsList });
    set({ timer: 6000 });
    set({ isOnBreak: false });
    set({ intervalId: null });
    localStorage.setItem("questions", JSON.stringify(questionsList));
    localStorage.setItem("timer", JSON.stringify(6000));
    localStorage.setItem("isOnBreak", JSON.stringify(false));
  },

  startTimer: () => {
    const { intervalId, isOnBreak } = get();
    if (intervalId || isOnBreak) return; // Prevent multiple starts

    const newIntervalId = setInterval(() => {
      set((state) => {
        const newTimer = Math.max(0, state.timer - 1);
        localStorage.setItem("timer", JSON.stringify(newTimer));
        return { timer: newTimer };
      });
    }, 1000);

    set({ intervalId: newIntervalId, isOnBreak: false });
    localStorage.setItem("isOnBreak", JSON.stringify(false));
  },

  stopTimer: () => {
    const { intervalId } = get();
    if (intervalId) {
      clearInterval(intervalId);
      set({ intervalId: null, timer: 6000, isOnBreak: false }); // Reset everything
      localStorage.setItem("timer", JSON.stringify(6000));
      localStorage.setItem("isOnBreak", JSON.stringify(false));
    }
  },

  startBreak: () => {
    const { intervalId } = get();
    if (intervalId) {
      clearInterval(intervalId);
      set({ intervalId: null, isOnBreak: true });
      localStorage.setItem("isOnBreak", JSON.stringify(true));
    }
  },

  stopBreak: () => {
    set({ isOnBreak: false });
    localStorage.setItem("isOnBreak", JSON.stringify(false));
    get().startTimer(); // Resume timer
  },

  updateQuestion: (order, question) => {
    const { questions } = get();
    const index = questions.findIndex((q) => q.order === order);
    if (index === -1) return;

    const newQuestions = [...questions];
    newQuestions[index] = question;
    set({ questions: newQuestions });

    localStorage.setItem("questions", JSON.stringify(newQuestions));
  },

  getAnsweredQuestions: () => {
    return get().questions.filter((q) => q.isAnswered);
  },
}));
