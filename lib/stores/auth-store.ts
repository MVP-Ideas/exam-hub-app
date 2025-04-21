import { create } from "zustand";
import { TokenResponse } from "../types/auth";
import { User } from "@/lib/types/user";
import { loadLocalState, saveToLocalStorage } from "./utils";

type AuthStore = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: Date | null;

  login: (token: TokenResponse) => void;
  logout: () => void;
  refreshTokens: (token: TokenResponse) => void;

  setAccessToken: (accessToken: string | null) => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setUser: (user: User | null) => void;
  getUser: () => User | null;
};

const initialState = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: loadLocalState("user", null),
  accessToken: loadLocalState("accessToken", null),
  refreshToken: loadLocalState("refreshToken", null),
  expiresAt: loadLocalState("expiresAt", null),
  login: ({ accessToken, refreshToken, expiresAt }) => {
    set({ accessToken, refreshToken, expiresAt });
    saveToLocalStorage("accessToken", accessToken);
    saveToLocalStorage("refreshToken", refreshToken);
    saveToLocalStorage("expiresAt", expiresAt);
  },

  logout: () => {
    set(initialState);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expiresAt");
    localStorage.removeItem("user");
  },

  refreshTokens: ({ accessToken, refreshToken, expiresAt }) => {
    set({ accessToken, refreshToken, expiresAt });
    saveToLocalStorage("accessToken", accessToken);
    saveToLocalStorage("refreshToken", refreshToken);
    saveToLocalStorage("expiresAt", expiresAt);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  },

  setAccessToken: (accessToken: string | null) => {
    set({ accessToken });
    saveToLocalStorage("accessToken", accessToken);
  },
  getAccessToken: () => get().accessToken,

  getRefreshToken: () => get().refreshToken,

  setUser: (user: User | null) => {
    set({ user });
    saveToLocalStorage("user", user);
  },

  getUser: () => get().user,
}));
