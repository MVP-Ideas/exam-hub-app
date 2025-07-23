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
import { ExamSessionResponse } from "@/lib/types/exam-session";
import { ExamSessionQuestionResponse } from "@/lib/types/exam-session-question";
import { CreateAnswerRequest } from "@/lib/types/answer";
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
import { ThemeDropdown } from "@/components/common/ThemeDropdown";
import ExamSessionResourcesModal from "./ExamSessionResourcesModal";
import { Calculator } from "./Calculator";

type Props = {
  examSession: ExamSessionResponse;
  endable: boolean;
  questions: ExamSessionQuestionResponse[];
  answers: CreateAnswerRequest[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  navMode: "numbers" | "questions";
  setNavMode: (mode: "numbers" | "questions") => void;
  isPaused?: boolean;
  setPaused?: (paused: boolean) => void;
  isSubmitting?: boolean;
  showSubmitDialog: () => void; // Changed from submitExamSession to showSubmitDialog
};

export default function ExamSessionToolbar({
  examSession,
  endable,
  questions: examSessionQuestions,
  answers,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  navMode,
  setNavMode,
  isPaused,
  setPaused,
  showSubmitDialog, // Updated prop name
}: Props) {
  const router = useRouter();
  const { flaggedQuestions } = useExamSessionStore();
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const { createQuestionFeedback, isPending: isSubmittingFeedback } =
    useCreateQuestionFeedback();

  const handleFeedbackSubmit = async () => {
    try {
      const currentQuestion = examSessionQuestions[currentQuestionIndex];
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

  const settings = examSession.settings || {};

  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <Sidebar
      variant="sidebar"
      className="bg-muted/40 flex flex-col gap-y-2 p-2"
    >
      <SidebarHeader className="bg-muted mb-2 flex items-start gap-y-1 rounded-lg p-4">
        <p className="text-sm font-bold">Question {currentQuestionIndex + 1}</p>
        {settings.showQuestionPoints && (
          <p className="text-primary text-xs font-bold">
            {examSessionQuestions[currentQuestionIndex].points} point
            {examSessionQuestions[currentQuestionIndex].points > 1 ? "s" : ""}
          </p>
        )}
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
              {examSessionQuestions.map((examSessionQuestion, index) => (
                <div key={index} className="relative">
                  {flaggedQuestions.includes(examSessionQuestion.id) && (
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
                      answers.find(
                        (a) =>
                          a &&
                          a.examSessionQuestionId === examSessionQuestion.id &&
                          a.choices &&
                          a.choices.length > 0,
                      ) &&
                        index !== currentQuestionIndex &&
                        "bg-green-300 text-black dark:bg-green-900 dark:text-green-300",
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
              {examSessionQuestions.map((examSessionQuestion, index) => (
                <div key={index} className="relative">
                  {flaggedQuestions.includes(examSessionQuestion.id) && (
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
                      answers.find(
                        (a) =>
                          a &&
                          a.choices &&
                          a.examSessionQuestionId === examSessionQuestion.id &&
                          a.choices.length > 0,
                      ) &&
                        index !== currentQuestionIndex &&
                        "text-foreground bg-green-300 hover:bg-green-400 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800",
                    )}
                    onClick={() => {
                      setCurrentQuestionIndex(index + 1);
                    }}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="bg-muted text-muted-foreground flex h-4 w-4 items-center justify-center rounded-full text-xs font-semibold">
                        {index + 1}
                      </span>
                      <span className="truncate">
                        {examSessionQuestion.question.text}
                      </span>
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
              {settings.showCalculator && (
                <Button
                  variant="outline"
                  className="w-full font-semibold"
                  onClick={() => setCalculatorOpen(!calculatorOpen)}
                >
                  <CalculatorIcon className="h-4 w-4" />
                  Calculator
                </Button>
              )}
              {settings.showExamResourcesDuringSession && (
                <Button
                  variant="outline"
                  className="w-full font-semibold"
                  onClick={() => setResourcesOpen(true)}
                >
                  <BookIcon className="h-4 w-4" />
                  Resources
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full font-semibold"
                disabled
              >
                <FileQuestion className="h-4 w-4" />
                Help (Ongoing)
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
                <Button onClick={showSubmitDialog}>
                  <ArrowRightToLine className="h-4 w-4" />
                  Submit Exam
                </Button>
              )}
            </div>
          </div>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <ThemeDropdown justify="center" />
        <Button
          variant="ghost"
          className="hover:bg-destructive hover:text-background w-full font-bold"
          onClick={() => {
            router.push(`/exams/${examSession.exam.id}`);
          }}
        >
          <ArrowLeftToLine />
          Exit Exam
        </Button>
      </SidebarFooter>
      <SidebarRail />

      {/* Question Feedback Dialog - Only dialog remaining in this component */}
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

      {/* Calculator Dialog */}
      <Calculator open={calculatorOpen} onOpenChange={setCalculatorOpen} />

      {/* Resources Modal */}
      <ExamSessionResourcesModal
        open={resourcesOpen}
        onOpenChange={setResourcesOpen}
        examSession={examSession}
      />
    </Sidebar>
  );
}
