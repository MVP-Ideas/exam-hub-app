"use client";

import ExamSessionToolbar from "@/components/learner/exam-session/exam-session-toolbar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import useExamSessionById from "@/hooks/exam-sessions/useExamSessionById";
import { Menu, TimerIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QuestionBox from "@/components/learner/exam-session/question-box";
import useCountdown from "@/hooks/timer/useCountdown";
import useUpdateExamProgress from "@/hooks/exam-sessions/useUpdateExamProgress";
import { useExamSessionStore } from "@/lib/stores/exam-session-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useSubmitExamSession from "@/hooks/exam-sessions/useSubmitExamSession";
import AppLoader from "@/components/common/app-loader";
export default function Page() {
  const router = useRouter();
  const { id, index } = useParams();
  const { examSession, isLoading, isError } = useExamSessionById(id as string);
  const { updateProgress } = useUpdateExamProgress(id as string);
  const { submitExamSession, isPending: isSubmitting } = useSubmitExamSession(
    id as string,
  );
  const questions = examSession?.questions || [];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    parseInt(index as string) || 1,
  );

  // Use the store for navMode
  const { navMode, setNavMode, setLastVisitedExamId } = useExamSessionStore();

  const initialTimeSeconds = examSession
    ? examSession.maxTimeSeconds - examSession.timeSpentSeconds
    : 0;

  const { formatTime, isPaused, setPaused } = useCountdown({
    initialSeconds: initialTimeSeconds,
    updateInterval: 10,
    onComplete: () => {
      updateProgress(initialTimeSeconds);
      handleSubmitExamSession();
    },
    onTimeUpdate: (seconds) => {
      if (examSession?.maxTimeSeconds) {
        const timeSpentSeconds = initialTimeSeconds - seconds;

        if (timeSpentSeconds > 0) {
          updateProgress(timeSpentSeconds);
        }
      }
    },
  });

  const handleSubmitExamSession = async () => {
    try {
      await submitExamSession();
      router.push(`/sessions/${examSession?.id}/finish`);
    } catch (error) {
      console.error(error);
    }
  };

  // Update last visited exam when the session changes
  useEffect(() => {
    if (examSession?.exam?.id) {
      setLastVisitedExamId(examSession.exam.id);
    }
  }, [examSession?.exam?.id, setLastVisitedExamId]);

  useEffect(() => {
    router.push(`/sessions/${id}/${currentQuestionIndex}`);
  }, [id, currentQuestionIndex, router]);

  if ((isLoading || !examSession) && !isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <AppLoader />
      </div>
    );
  }

  if (isError || !examSession || questions.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex w-full max-w-sm flex-col items-center justify-center gap-y-2 text-center">
          <p className="text-destructive">Error loading exam session</p>
          <p className="text-muted-foreground">
            Please check your internet connection and try again. The exam
            session may not exist or you may not have access to it.
          </p>
          <p className="text-muted-foreground">
            There may be also no questions in this exam session. Please contact
            us for more information.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/exams")}
            className="w-full"
          >
            Go to Exams
          </Button>
        </div>
      </div>
    );
  }

  // Calculate number of answered questions
  const answeredQuestions = questions.filter((q) => q.answer).length;

  return (
    <div className="flex h-full w-full flex-row">
      <ExamSessionToolbar
        endable={answeredQuestions === questions.length}
        examId={examSession.exam.id}
        questions={questions}
        currentQuestionIndex={currentQuestionIndex - 1}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        navMode={navMode}
        setNavMode={setNavMode}
        isPaused={isPaused}
        setPaused={setPaused}
        isSubmitting={isSubmitting}
        submitExamSession={handleSubmitExamSession}
      />
      <div className="flex h-full w-full flex-col">
        <header className="flex w-full flex-row items-center justify-between p-4">
          <div className="flex flex-row items-center gap-x-2">
            <SidebarTrigger icon={<Menu />} />
            <div className="flex flex-col">
              <h2 className="truncate font-bold">{examSession.exam.title}</h2>
              <p className="text-muted-foreground text-xs">
                {examSession.exam.categories?.[0]?.name}
              </p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-x-2">
            <TimerIcon className="h-4 w-4" />
            <div className="flex flex-col items-end">
              <p className="text-muted-foreground text-xs">Time Remaining</p>
              <p className="text-lg font-bold">{formatTime()}</p>
            </div>
          </div>
        </header>
        <Separator />
        {/* Exam Progress Bar */}
        <div className="flex w-full flex-col gap-y-2 px-6 py-4">
          <div className="flex w-full flex-row items-center justify-between">
            <p className="text-muted-foreground text-xs">Exam Progress</p>
            <p className="text-muted-foreground text-xs">
              {answeredQuestions}/{questions.length} Questions
            </p>
          </div>
          <Progress value={(answeredQuestions / questions.length) * 100} />
        </div>
        <Separator />
        {/* Question */}
        <div className="flex flex-1 flex-col">
          <QuestionBox
            examSessionId={id as string}
            questionId={questions[currentQuestionIndex - 1].id}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            disabledNextButton={currentQuestionIndex === questions.length}
          />
        </div>
      </div>

      {/* Pause Dialog */}
      <Dialog
        open={isPaused}
        onOpenChange={(open) => !open && setPaused(false)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Exam Paused</DialogTitle>
            <DialogDescription>
              Your exam timer has been paused. Take the time you need, and when
              you&apos;re ready to continue, click the button below.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Time Remaining</p>
              <p className="text-2xl font-bold">{formatTime()}</p>
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => setPaused(false)}
              className="w-full sm:w-auto"
            >
              Continue Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
