import { ProblemDetails } from "@/lib/types/error";
import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAlphabetByOrder(order: number): string | null {
  if (order < 1 || order > 26) return null; // Only A-Z
  return String.fromCharCode(64 + order); // 'A' starts at 65
}

export const extractAxiosErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Partial<ProblemDetails> | undefined;

    if (data?.detail) return data.detail;
    if (data?.title) return data.title;
    if (error.message) return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred.";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isProblemDetails = (data: any): data is ProblemDetails => {
  return (
    data != null &&
    typeof data.title === "string" &&
    typeof data.detail === "string" &&
    typeof data.status === "number"
  );
};
