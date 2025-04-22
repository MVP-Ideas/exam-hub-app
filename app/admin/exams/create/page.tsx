'use client';

import ExamForm from '@/components/admin/exams/exam-form';

export default function Page() {
	return (
		<div className="flex w-full flex-col items-center">
			<div className="flex flex-col w-full max-w-5xl items-center h-full p-10 gap-6">
				<div className="w-full">
					<h1 className="text-2xl font-bold">Create New Exam</h1>
					<p className="text-sm">
						Set up exam details, add questions, and configure settings.
					</p>
				</div>
				<div className="w-full">
					<ExamForm />
				</div>
			</div>
		</div>
	);
}
