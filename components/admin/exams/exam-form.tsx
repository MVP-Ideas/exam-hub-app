'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { useExamFormStore, createExamSchema } from '@/lib/stores/exam-store';
import { SaveIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ExamDetails from './exam-details';
import ExamStudyResources from './exam-study-resources';
import ExamQuestions from './exam-questions';
import ExamSettings from './exam-settings';

export default function ExamForm() {
	const router = useRouter();
	const { form: storedForm, setField, resetForm } = useExamFormStore();

	const form = useForm<z.infer<typeof createExamSchema>>({
		resolver: zodResolver(createExamSchema),
		defaultValues: storedForm,
	});

	// Sync Zustand store on field changes
	useEffect(() => {
		const subscription = form.watch((values, { name }) => {
			if (name) {
				setField(name as keyof typeof values, values[name]);
			}
		});
		return () => subscription.unsubscribe();
	}, [form, form.watch, setField]);

	const onSubmit = (data: z.infer<typeof createExamSchema>) => {
		console.log('Submitted Exam Data:', data);
	};

	const onCancel = () => {
		resetForm();
		router.back();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
				{/* Exam Details */}
				<ExamDetails control={form.control} />

				{/* Study Resources */}
				<ExamStudyResources />

				{/* Questions */}
				<ExamQuestions />

				{/* Exam Settings */}
				<ExamSettings />

				<div className="mt-6 flex flex-row justify-between items-center">
					<Button
						type="submit"
						variant="ghost"
						className="border border-primary/20 px-6"
						onClick={onCancel}
					>
						Cancel
					</Button>
					<div className="flex flex-row space-x-4 items-center">
						<Button
							type="submit"
							variant="ghost"
							className="border border-primary/20 px-6"
						>
							Save as Draft
						</Button>
						<Button
							type="submit"
							variant="default"
							className="border border-primary/20 px-6"
						>
							<SaveIcon className="mr-2" />
							Save and Continue
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
