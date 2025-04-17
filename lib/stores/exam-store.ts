import { create } from 'zustand';
import { z } from 'zod';
import { loadLocalState, saveToLocalStorage } from './utils';

export const createExamSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	category: z.string(),
	difficulty: z.string(),
	timeLimit: z
		.number({ invalid_type_error: 'Time Limit must be a number' })
		.min(1, 'Time Limit must be at least 1 minute'),
	passingScore: z.number().min(0, 'Passing Score must be at least 0%'),
});

export type ExamFormData = z.infer<typeof createExamSchema>;

interface ExamFormStore {
	form: ExamFormData;
	setField: <K extends keyof ExamFormData>(
		key: K,
		value: ExamFormData[K]
	) => void;
	resetForm: () => void;
}

const LOCAL_STORAGE_KEY = 'exam-form-storage';

const defaultForm: ExamFormData = {
	title: '',
	description: '',
	category: '',
	difficulty: '',
	timeLimit: 60,
	passingScore: 70,
};

export const useExamFormStore = create<ExamFormStore>((set, get) => ({
	form: loadLocalState<ExamFormData>(LOCAL_STORAGE_KEY, defaultForm),

	setField: (key, value) => {
		const updated = {
			...get().form,
			[key]: value,
		};
		saveToLocalStorage(LOCAL_STORAGE_KEY, updated);
		set({ form: updated });
	},

	resetForm: () => {
		saveToLocalStorage(LOCAL_STORAGE_KEY, defaultForm);
		set({ form: defaultForm });
	},
}));
