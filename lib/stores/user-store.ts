"use client";

import { create } from "zustand";
import { User } from "@/lib/types/user";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserState = {
  user: User | null;
  lastUpdated: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

// Create a custom storage that falls back safely when window is undefined
const customStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(name, value);
  },
  removeItem: (name: string): void => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(name);
  },
};

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      user: null,
      lastUpdated: null,
      setUser: (user) => set({ user, lastUpdated: new Date().toISOString() }),
      clearUser: () => set({ user: null, lastUpdated: null }),
    }),
    {
      name: "user-storage",
      // Only skip hydration on server to avoid hydration mismatch
      skipHydration: typeof window === "undefined",
      storage: createJSONStorage(() => customStorage),
    },
  ),
);
