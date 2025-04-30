import { createStore } from "zustand";
import { User } from "@/lib/types/user";

export type UserState = {
  user: User | null;
  lastUpdated: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const createUserStore = () => {
  return createStore<UserState>((set) => ({
    user: null,
    lastUpdated: null,
    setUser: (user) => set({ user, lastUpdated: new Date().toISOString() }),
    clearUser: () => set({ user: null }),
  }));
};
