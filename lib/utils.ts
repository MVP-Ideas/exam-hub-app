import { ProblemDetails } from "@/lib/types/error";
import axios, { AxiosError } from "axios";
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
    const response = error.response?.data as
      | Partial<ProblemDetails>
      | undefined;
    const details = (error as AxiosError & { details?: ProblemDetails })
      .details;

    if (details?.detail) return details.detail;
    if (response?.detail) return response.detail;
    if (response?.title) return response.title;
  }

  if (error instanceof Error) return error.message;

  return "An unknown error occurred";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isProblemDetails = (data: any): data is ProblemDetails => {
  return typeof data?.status === "number" && typeof data?.detail === "string";
};
