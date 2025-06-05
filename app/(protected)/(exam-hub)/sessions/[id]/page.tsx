"use client";

import ExamSessionToolbar from "@/components/learner/exam-session/exam-session-toolbar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import useExamSessionById from "@/hooks/exam-sessions/useExamSessionById";
import { Menu, TimerIcon } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
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
import { ExamSessionAnswerCreate } from "@/lib/types/exam-session";
import { cn } from "@/lib/utils";

export default function Page() {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const { examSession, isLoading, isError } = useExamSessionById(id as string);
  const { updateProgress, isPending: isUpdatingProgress } =
    useUpdateExamProgress(id as string);
  const { submitExamSession, isPending: isSubmitting } = useSubmitExamSession(
    id as string,
  );
  const questions = useMemo(() => examSession?.questions || [], [examSession]);
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);

  const questionFromUrl = parseInt(searchParams.get("question") || "1");
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(questionFromUrl);

  useEffect(() => {
    const questionFromUrl = parseInt(searchParams.get("question") || "1");
    if (questionFromUrl !== currentQuestionIndex) {
      setCurrentQuestionIndex(questionFromUrl);
    }
  }, [searchParams]);

  const {
    navMode,
    setNavMode,
    setLastVisitedExamSessionId,
    answers,
    setAnswers,
    lastVisitedExamSessionId,
    setLastSavedTime,
    clearData,
    flaggedQuestions,
  } = useExamSessionStore();

  // Add state for submit dialog
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const isUpdatingRef = useRef(false);
  const lastUpdateTimeRef = useRef(0);

  const handleTimeUpdate = useCallback(
    async (seconds: number) => {
      if (
        isSubmitting ||
        isSubmittingExam ||
        examSession?.finishedAt !== null ||
        isUpdatingRef.current ||
        !examSession?.maxTimeSeconds ||
        seconds <= 0 ||
        seconds === examSession?.maxTimeSeconds
      ) {
        return;
      }

      const now = Date.now();
      if (now - lastUpdateTimeRef.current < 10000) {
        return;
      }

      try {
        isUpdatingRef.current = true;
        lastUpdateTimeRef.current = now;

        await updateProgress({
          answers: answers.filter((a) => a && a.timeSpentSeconds > 0),
          timeRemainingSeconds: seconds,
        });

        setLastSavedTime(new Date());
      } catch (error) {
        console.error("Failed to update progress:", error);
      } finally {
        isUpdatingRef.current = false;
      }
    },
    [
      examSession?.maxTimeSeconds,
      examSession?.finishedAt,
      answers,
      updateProgress,
      setLastSavedTime,
      isSubmitting,
    ],
  );

  const handleTimerComplete = useCallback(async () => {
    if (!examSession?.id || isUpdatingRef.current) {
      return;
    }

    try {
      isUpdatingRef.current = true;

      await updateProgress({
        answers: answers.filter((a) => a && a.timeSpentSeconds > 0),
        timeRemainingSeconds: 0,
      });

      await handleSubmitExamSession();
    } catch (error) {
      console.error("Failed to handle timer completion:", error);
    } finally {
      isUpdatingRef.current = false;
    }
  }, [examSession?.id, answers, updateProgress]);

  const { formatTime, isPaused, setPaused, seconds } = useCountdown({
    initialSeconds: examSession?.maxTimeSeconds
      ? examSession.maxTimeSeconds - (examSession.timeSpentSeconds || 0)
      : undefined,
    updateInterval: 10,
    onComplete: handleTimerComplete,
    onTimeUpdate: handleTimeUpdate,
  });

  const handleSubmitExamSession = async () => {
    try {
      setIsSubmittingExam(true);
      await updateProgress({
        answers: answers,
        timeRemainingSeconds: seconds,
      });
      await submitExamSession();
      clearData();
      router.push(`/sessions/${examSession?.id}/finish`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingExam(false);
    }
  };

  // Function to show submit dialog
  const showSubmitExamDialog = () => {
    setShowSubmitDialog(true);
  };

  const navigateToQuestion = useCallback(
    (questionIndex: number) => {
      setCurrentQuestionIndex(questionIndex);
      const url = new URL(window.location.href);
      url.searchParams.set("question", questionIndex.toString());
      router.push(url.pathname + url.search, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    if (examSession && examSession.id !== lastVisitedExamSessionId) {
      clearData();
      setLastVisitedExamSessionId(examSession.id);
    }
  }, [examSession?.id, lastVisitedExamSessionId]);

  useEffect(() => {
    if (examSession?.id && questions.length > 0) {
      const answers = [];
      for (const question of questions) {
        answers.push({
          examSessionQuestionId: question.id,
          choices: question.answer?.choices || [],
          timeSpentSeconds: question.answer?.timeSpentSeconds || 0,
        });
      }

      setAnswers(answers as ExamSessionAnswerCreate[]);
    }
  }, [examSession?.id, questions.length]);

  const getCurrentAnswer = (
    questionId: string,
  ): ExamSessionAnswerCreate | undefined => {
    return answers.find(
      (answer) => answer?.examSessionQuestionId === questionId,
    );
  };

  const updateAnswerByQuestionId = (updatedAnswer: ExamSessionAnswerCreate) => {
    if (isSubmitting || isUpdatingProgress) {
      return;
    }

    console.log("updateAnswerByQuestionId", updatedAnswer);
    const newAnswers = [...answers] as ExamSessionAnswerCreate[];
    const existingIndex = newAnswers.findIndex(
      (answer) =>
        answer?.examSessionQuestionId === updatedAnswer.examSessionQuestionId,
    );

    if (existingIndex !== -1) {
      newAnswers[existingIndex] = updatedAnswer;
    } else {
      newAnswers.push(updatedAnswer);
    }

    setAnswers(newAnswers);
  };

  if (
    (isLoading || !examSession || isSubmitting || isSubmittingExam) &&
    !isError
  ) {
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

  const answeredQuestions = questions.filter((q) =>
    answers.some(
      (a) =>
        a &&
        a.examSessionQuestionId === q.id &&
        a.choices &&
        a.choices.length > 0,
    ),
  ).length;

  if (examSession.finishedAt !== null) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex w-full max-w-sm flex-col items-center justify-center gap-y-2 text-center">
          <p className="text-destructive">Exam finished</p>
          <p className="text-muted-foreground">
            You can review your answers and see your results.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              submitExamSession();
              router.push(`/results/${examSession.id}`);
            }}
            className="w-full"
          >
            Go to Results
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-row">
      <ExamSessionToolbar
        endable={answeredQuestions === questions.length}
        examId={examSession.exam.id}
        questions={questions}
        answers={answers}
        currentQuestionIndex={currentQuestionIndex - 1}
        setCurrentQuestionIndex={navigateToQuestion}
        navMode={navMode}
        setNavMode={setNavMode}
        isPaused={isPaused}
        setPaused={setPaused}
        isSubmitting={isSubmitting || isUpdatingProgress}
        showSubmitDialog={showSubmitExamDialog}
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
          <div className="flex flex-row items-center justify-center gap-x-2">
            <div className="flex flex-col items-end">
              <div className="flex flex-row items-center gap-x-1">
                <TimerIcon className="h-3 w-3" />
                <p className="text-muted-foreground text-xs">Time Remaining</p>
              </div>
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
            question={questions[currentQuestionIndex - 1]}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={navigateToQuestion}
            disabledNextButton={currentQuestionIndex === questions.length}
            answer={
              getCurrentAnswer(questions[currentQuestionIndex - 1]?.id) || {
                examSessionQuestionId: questions[currentQuestionIndex - 1]?.id,
                choices: [],
                timeSpentSeconds: 0,
                aiAssitanceUsed: false,
                toBeReviewed: false,
              }
            }
            setAnswer={updateAnswerByQuestionId}
            isUpdatingProgress={isUpdatingProgress}
            isReadyToSubmit={answeredQuestions === questions.length}
            showSubmitDialog={showSubmitExamDialog}
            isPaused={isPaused}
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
          <div className="flex items-center justify-center py-6">
            <div className="flex flex-col items-center">
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

      {/* Submit Exam Dialog - Moved from ExamSessionToolbar */}
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
                setShowSubmitDialog(false);
              }}
            >
              Return to Exam
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setShowSubmitDialog(false);
                handleSubmitExamSession();
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit Exam"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
