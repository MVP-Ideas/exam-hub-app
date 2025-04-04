import { ProblemDetails } from '@/types/error';
import { AxiosError } from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getAlphabetByOrder(order: number): string | null {
	if (order < 1 || order > 26) return null; // Only A-Z
	return String.fromCharCode(64 + order); // 'A' starts at 65
}

export const extractAxiosErrorMessage = (error: Error): string => {
	if (!(error instanceof AxiosError)) {
		return error.message;
	}
	const response = error?.response?.data as ProblemDetails;

	if (response && response.detail) {
		return response.detail;
	}
	if (error.message) {
		return error.message;
	}
	return 'An unknown error occurred';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isProblemDetails = (data: any): data is ProblemDetails => {
	return typeof data?.status === 'number' && typeof data?.detail === 'string';
};
