import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  BookIcon,
  CalculatorIcon,
  FileQuestion,
  Grid2X2,
  ListOrdered,
  MessageCircle,
  PauseCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ExamSessionQuestion } from "@/lib/types/exam-session";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useExamSessionStore } from "@/lib/stores/exam-session-store";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import useCreateQuestionFeedback from "@/hooks/question-feedback/useCreateQuestionFeedback";

type Props = {
  examId: string;
  endable: boolean;
  questions: ExamSessionQuestion[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  navMode: "numbers" | "questions";
  setNavMode: (mode: "numbers" | "questions") => void;
  isPaused?: boolean;
  setPaused?: (paused: boolean) => void;
  isSubmitting?: boolean;
  submitExamSession?: () => void;
};

export default function ExamSessionToolbar({
  examId,
  endable,
  questions,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  navMode,
  setNavMode,
  isPaused,
  setPaused,
  isSubmitting,
  submitExamSession,
}: Props) {
  const router = useRouter();
  const { flaggedQuestions } = useExamSessionStore();
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const { createQuestionFeedback, isPending: isSubmittingFeedback } =
    useCreateQuestionFeedback();

  const handleFeedbackSubmit = async () => {
    try {
      const currentQuestion = questions[currentQuestionIndex];
      await createQuestionFeedback({
        examSessionQuestionId: currentQuestion.id,
        feedback: feedbackText,
      });

      setFeedbackText("");
      setShowFeedbackDialog(false);
    } catch (error) {
      // Error is already handled by the hook with toast notification
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <Sidebar
      variant="sidebar"
      className="bg-muted/40 flex flex-col gap-y-2 p-2"
    >
      <SidebarHeader className="bg-muted mb-2 flex items-start gap-y-1 rounded-lg p-4">
        <p className="text-sm font-bold">Question {currentQuestionIndex + 1}</p>
        <p className="text-primary text-xs font-bold">
          {questions[currentQuestionIndex].points} point
          {questions[currentQuestionIndex].points > 1 ? "s" : ""}
        </p>
      </SidebarHeader>

      <SidebarContent className="bg-background rounded-lg p-4">
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-row items-center justify-between">
            <p className="text-primary text-sm font-semibold">
              Item Navigation
            </p>
            <div className="flex items-center rounded-md border">
              <Button
                variant="ghost"
                size="sm"
                className={cn("h-4 p-4", navMode === "numbers" && "bg-muted")}
                onClick={() => setNavMode("numbers")}
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn("h-4 p-4", navMode === "questions" && "bg-muted")}
                onClick={() => setNavMode("questions")}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {navMode === "numbers" ? (
            <div className="grid grid-cols-6 gap-2">
              {questions.map((question, index) => (
                <div key={index} className="relative">
                  {flaggedQuestions.includes(question.id) && (
                    <div className="absolute -top-1 -right-1">
                      <div className="bg-destructive flex h-3 w-3 items-center justify-center rounded-full" />
                    </div>
                  )}
                  <Button
                    variant={
                      index === currentQuestionIndex ? "default" : "outline"
                    }
                    className={cn(
                      "h-8 w-8 p-0 text-sm font-semibold",
                      question.answer &&
                        index !== currentQuestionIndex &&
                        "bg-green-300 text-black",
                    )}
                    onClick={() => {
                      setCurrentQuestionIndex(index + 1);
                    }}
                  >
                    {index + 1}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="custom-scrollbar flex max-h-72 flex-col overflow-y-auto pt-2 pr-1">
              {questions.map((question, index) => (
                <div key={index} className="relative">
                  {flaggedQuestions.includes(question.id) && (
                    <div className="absolute -top-0 -right-0">
                      <div className="bg-destructive flex h-2 w-2 items-center justify-center rounded-full" />
                    </div>
                  )}
                  <Button
                    key={index}
                    variant={
                      index === currentQuestionIndex ? "default" : "outline"
                    }
                    className={cn(
                      "mb-1 h-auto w-full justify-start p-1 text-left text-xs font-medium",
                      question.answer &&
                        index !== currentQuestionIndex &&
                        "text-foreground bg-green-300 hover:bg-green-400",
                    )}
                    onClick={() => {
                      setCurrentQuestionIndex(index + 1);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="bg-muted text-muted-foreground flex h-4 w-4 items-center justify-center rounded-full text-xs font-semibold">
                        {index + 1}
                      </span>
                      <span className="truncate">{question.text}</span>
                    </div>
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Separator className="my-2" />
          <div className="flex flex-col gap-y-2">
            <p className="text-primary text-sm font-semibold">Exam Tools</p>
            <div className="flex flex-col gap-y-2">
              <Button variant="outline" className="w-full font-semibold">
                <CalculatorIcon className="h-4 w-4" />
                Calculator
              </Button>
              <Button variant="outline" className="w-full font-semibold">
                <BookIcon className="h-4 w-4" />
                Resources
              </Button>
              <Button variant="outline" className="w-full font-semibold">
                <FileQuestion className="h-4 w-4" />
                Help
              </Button>
              <Button
                variant="outline"
                className="w-full font-semibold"
                onClick={() => setShowFeedbackDialog(true)}
              >
                <MessageCircle className="h-4 w-4" />
                Question Feedback
              </Button>
              {setPaused && (
                <Button
                  variant="outline"
                  className="w-full font-semibold"
                  onClick={() => setPaused(true)}
                  disabled={isPaused}
                >
                  <PauseCircle className="h-4 w-4" />
                  Take a Break
                </Button>
              )}
              {endable && (
                <Button
                  variant="secondary"
                  onClick={() => setShowSubmitDialog(true)}
                >
                  <ArrowRightToLine className="h-4 w-4" />
                  Submit Exam
                </Button>
              )}
            </div>
          </div>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="ghost"
          className="hover:bg-destructive hover:text-background w-full font-bold"
          onClick={() => {
            router.push(`/exams/${examId}`);
          }}
        >
          <ArrowLeftToLine />
          Exit Exam
        </Button>
      </SidebarFooter>
      <SidebarRail />

      {/* Submit Exam Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Exam Summary</DialogTitle>
            <DialogDescription>
              Review your answers before submitting the exam.
            </DialogDescription>
          </DialogHeader>

          {/* Overview */}
          <div className="mt-4 grid w-full grid-cols-3 gap-4 text-center">
            <div className="rounded-lg border bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-700">
                Total Questions
              </p>
              <p className="text-xl font-bold text-blue-900">
                {questions.length}
              </p>
            </div>
            <div className="rounded-lg border bg-green-50 p-4">
              <p className="text-sm font-semibold text-green-700">Answered</p>
              <p className="text-xl font-bold text-green-900">
                {questions.filter((q) => q.answer).length}
              </p>
            </div>
            <div className="rounded-lg border bg-yellow-50 p-4">
              <p className="text-sm font-semibold text-yellow-700">Flagged</p>
              <p className="text-xl font-bold text-yellow-900">
                {
                  questions.filter((q) => flaggedQuestions.includes(q.id))
                    .length
                }
              </p>
            </div>
          </div>

          {/* Question List */}
          <div className="mt-6">
            <p className="text-primary mb-2 text-sm font-semibold">Questions</p>
            <div className="custom-scrollbar flex max-h-60 flex-col gap-2 overflow-y-auto pr-2">
              {questions.map((q, index) => {
                const isAnswered = !!q.answer;
                const isFlagged = flaggedQuestions.includes(q.id);

                return (
                  <div
                    key={q.id}
                    className={cn(
                      "flex items-center justify-between rounded border p-2 text-sm",
                      isAnswered
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50",
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
                        setShowSubmitDialog(false);
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
          {questions.some((q) => !q.answer) && (
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
                setShowSubmitDialog(false);
              }}
            >
              Return to Exam
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setShowSubmitDialog(false);
                submitExamSession?.();
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit Exam"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Question Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Question Feedback</DialogTitle>
            <DialogDescription>
              Please provide feedback about the current question. This will help
              us improve our exam content.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="feedback">Your Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Describe any issues or suggestions you have about this question..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setFeedbackText("");
                setShowFeedbackDialog(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleFeedbackSubmit}
              disabled={!feedbackText.trim() || isSubmittingFeedback}
            >
              {isSubmittingFeedback ? "Submitting..." : "Submit Feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
