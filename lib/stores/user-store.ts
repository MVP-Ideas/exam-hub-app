"use client";

import { create } from "zustand";
import { User } from "@/lib/types/user";
import { persist } from "zustand/middleware";

export type UserState = {
  user: User | null;
  lastUpdated: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
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
      skipHydration: true,
      storage: {
        getItem: (name) => {
          const str =
            typeof window !== "undefined"
              ? window.localStorage.getItem(name)
              : null;
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") {
            window.localStorage.removeItem(name);
          }
        },
      },
    },
  ),
);
