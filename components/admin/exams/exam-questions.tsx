import ExamQuestionsSheet from './exam-questions-sheet';

export default function ExamQuestions() {
	return (
		<div className="flex flex-col w-full gap-4 bg-background p-5 rounded-lg border border-muted-foreground/20">
			<h2 className="text-lg font-bold">Question</h2>

			<ExamQuestionsSheet />
		</div>
	);
}
