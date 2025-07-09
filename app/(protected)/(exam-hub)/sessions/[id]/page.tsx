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
import useExamTimer from "@/hooks/exam-sessions/useExamTimer";
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
import ExamSessionSubmitModal from "@/components/learner/exam-session/exam-session-submit-modal";

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
  const questionIds = useMemo(() => questions.map((q) => q.id), [questions]);
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);

  const questionFromUrl = parseInt(searchParams.get("question") || "1");
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(questionFromUrl);

  useEffect(() => {
    const questionFromUrl = parseInt(searchParams.get("question") || "1");
    if (questionFromUrl !== currentQuestionIndex) {
      setCurrentQuestionIndex(questionFromUrl);
    }
  }, [searchParams, currentQuestionIndex]);

  const {
    navMode,
    setNavMode,
    answers,
    setAnswers,
    setLastSavedTime,
    clearData,
    flaggedQuestions,
  } = useExamSessionStore();

  // Add state for submit dialog
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const isUpdatingRef = useRef(false);
  const lastUpdateTimeRef = useRef(0);

  const handleTimeUpdate = useCallback(
    async (timeSpentSeconds: number) => {
      if (
        isLoading ||
        isSubmitting ||
        isSubmittingExam ||
        examSession?.finishedAt !== null ||
        isUpdatingRef.current ||
        timeSpentSeconds <= 0
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
          answers: answers.filter(
            (a) =>
              a &&
              a.timeSpentSeconds > 0 &&
              questionIds.includes(a.examSessionQuestionId),
          ),
          timeSpentSeconds: timeSpentSeconds,
        });

        setLastSavedTime(new Date());
      } catch (error) {
        console.error("Failed to update progress:", error);
      } finally {
        isUpdatingRef.current = false;
      }
    },
    [
      examSession?.finishedAt,
      answers,
      updateProgress,
      setLastSavedTime,
      isSubmitting,
      isSubmittingExam,
      questionIds,
    ],
  );

  const handleSubmitExamSession = async () => {
    try {
      setIsSubmittingExam(true);
      await updateProgress({
        answers: answers.filter((a) =>
          questionIds.includes(a.examSessionQuestionId),
        ),
        timeSpentSeconds: timeSpentSeconds,
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

  const handleTimerComplete = async () => {
    if (!examSession?.id || isUpdatingRef.current) {
      return;
    }

    try {
      isUpdatingRef.current = true;

      await updateProgress({
        answers: answers.filter((a) => a && a.timeSpentSeconds > 0),
        timeSpentSeconds: examSession?.maxTimeSeconds || 0,
      });

      await handleSubmitExamSession();
    } catch (error) {
      console.error("Failed to handle timer completion:", error);
    } finally {
      isUpdatingRef.current = false;
    }
  };

  const initialTimeSpentSeconds = useMemo(() => {
    if (examSession?.timeSpentSeconds) {
      return examSession.timeSpentSeconds;
    }
    return 0;
  }, [id, examSession?.timeSpentSeconds]);

  const {
    formatTimeRemaining,
    isPaused,
    setPaused,
    timeSpentSeconds,
    getTimerLabel,
  } = useExamTimer({
    maxTimeSeconds: examSession?.maxTimeSeconds || undefined,
    initialTimeSpentSeconds: initialTimeSpentSeconds,
    updateInterval: 10,
    onComplete: handleTimerComplete,
    onTimeUpdate: handleTimeUpdate,
  });

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
    if (examSession?.id && questions.length > 0) {
      setAnswers([]);
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
  }, [examSession?.id, questions, setAnswers]);

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
        examSession={examSession}
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
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-x-2">
            <div className="flex flex-col items-end">
              <div className="flex flex-row items-center gap-x-1">
                <TimerIcon className="h-3 w-3" />
                <p className="text-muted-foreground text-xs">
                  {getTimerLabel()}
                </p>
              </div>
              <p className="text-lg font-bold">{formatTimeRemaining()}</p>
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
            examSession={examSession}
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
              <p className="text-muted-foreground mb-2">{getTimerLabel()}</p>
              <p className="text-2xl font-bold">{formatTimeRemaining()}</p>
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
      <ExamSessionSubmitModal
        open={showSubmitDialog}
        onOpenChange={setShowSubmitDialog}
        questions={questions}
        answers={answers}
        answeredQuestions={answeredQuestions}
        flaggedQuestions={flaggedQuestions}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        onSubmit={handleSubmitExamSession}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
