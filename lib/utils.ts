import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAlphabetByOrder(order: number): string | null {
  if (order < 1 || order > 26) return null; // Only A-Z
  return String.fromCharCode(64 + order); // 'A' starts at 65
}
