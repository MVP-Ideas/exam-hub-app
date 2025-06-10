"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ExamSessionAnswerCreate,
  ExamSessionQuestion,
} from "@/lib/types/exam-session";

type ExamSessionSubmitModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: ExamSessionQuestion[];
  answers: ExamSessionAnswerCreate[];
  answeredQuestions: number;
  flaggedQuestions: string[];
  setCurrentQuestionIndex: (index: number) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
};

export default function ExamSessionSubmitModal({
  open,
  onOpenChange,
  questions,
  answers,
  answeredQuestions,
  flaggedQuestions,
  setCurrentQuestionIndex,
  onSubmit,
  isSubmitting,
}: ExamSessionSubmitModalProps) {
  const handleSubmit = async () => {
    onOpenChange(false);
    await onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Exam Summary</DialogTitle>
          <DialogDescription>
            Review your answers before submitting the exam.
          </DialogDescription>
        </DialogHeader>

        {/* Overview */}
        <div className="mt-4 grid w-full grid-cols-3 gap-4 text-center">
          <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-900">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              Total Questions
            </p>
            <p className="text-xl font-bold text-blue-900 dark:text-blue-300">
              {questions.length}
            </p>
          </div>
          <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-900">
            <p className="text-sm font-semibold text-green-700 dark:text-green-300">
              Answered
            </p>
            <p className="text-xl font-bold text-green-900 dark:text-green-300">
              {answeredQuestions}
            </p>
          </div>
          <div className="rounded-lg border bg-yellow-50 p-4 dark:bg-yellow-900">
            <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
              Flagged
            </p>
            <p className="text-xl font-bold text-yellow-900 dark:text-yellow-300">
              {questions.filter((q) => flaggedQuestions.includes(q.id)).length}
            </p>
          </div>
        </div>

        {/* Question List */}
        <div className="mt-6">
          <p className="text-primary mb-2 text-sm font-semibold">Questions</p>
          <div className="custom-scrollbar flex max-h-60 flex-col gap-2 overflow-y-auto pr-2">
            {questions.map((q, index) => {
              const isAnswered = !!answers.find(
                (a) =>
                  a &&
                  a.examSessionQuestionId === q.id &&
                  a.choices &&
                  a.choices.length > 0,
              );
              const isFlagged = flaggedQuestions.includes(q.id);

              return (
                <div
                  key={q.id}
                  className={cn(
                    "flex items-center justify-between rounded border p-2 text-sm",
                    isAnswered
                      ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900"
                      : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="max-w-[12rem] truncate">{q.text}</div>
                    <div className="flex gap-1">
                      {isAnswered && (
                        <span className="rounded border border-green-500 px-1 text-xs font-medium text-green-700">
                          Answered
                        </span>
                      )}
                      {isFlagged && (
                        <span className="rounded border border-yellow-500 px-1 text-xs font-medium text-yellow-700">
                          Flagged
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentQuestionIndex(index + 1);
                      onOpenChange(false);
                    }}
                  >
                    Review
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Warning */}
        {answeredQuestions < questions.length && (
          <div className="mt-4 rounded border border-orange-300 bg-orange-50 p-4 text-sm text-orange-700">
            You have unanswered questions. You can go back to complete them or
            submit the exam as is.
          </div>
        )}

        {/* Footer */}
        <DialogFooter className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Return to Exam
          </Button>
          <Button variant="default" onClick={handleSubmit}>
            {isSubmitting ? "Submitting..." : "Submit Exam"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
