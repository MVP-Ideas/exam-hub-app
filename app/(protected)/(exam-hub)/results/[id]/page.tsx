"use client";

import { Progress } from "@/components/ui/progress";
import useExamSessionResult from "@/hooks/exam-sessions/useExamSessionResult";
import useExamSessionPracticeOptions from "@/hooks/exam-sessions/useExamSessionPracticeOptions";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeIcon,
  RotateCcwIcon,
  XIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatUTCDate } from "@/lib/date-utils";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AppLoader from "@/components/common/AppLoader";
import { QuestionResult } from "@/components/learner/results/QuestionResult";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import { RetakeOptions } from "@/lib/types/exam-session";
import useRetakeExamSession from "@/hooks/exam-sessions/useRetakeExamSession";
import { toast } from "sonner";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { examSessionResult, isLoading, isError } = useExamSessionResult(
    id as string,
  );
  const { practiceOptions } = useExamSessionPracticeOptions(id as string);
  const { retakeExamSession, isPending } = useRetakeExamSession(id as string);

  const handleRetakeExamSession = async (retakeOption: RetakeOptions) => {
    const response = await retakeExamSession(retakeOption);
    if (response) {
      router.push(`/sessions/${response.id}`);
      toast.success("Exam retake started successfully");
    } else {
      toast.error("Failed to start exam retake");
    }
  };

  if (isLoading || isError) {
    return (
      <div className="flex h-screen w-full items-center justify-center py-10">
        <AppLoader />
      </div>
    );
  }

  const percentage = examSessionResult?.score
    ? (examSessionResult?.score / examSessionResult?.totalScore) * 100
    : 0;

  const correctWithoutAssistance = examSessionResult?.questions.filter(
    (q) => q.isCorrect && !q.aiAssistanceUsed,
  ).length;
  const correctWithAssistance = examSessionResult?.questions.filter(
    (q) => q.isCorrect && q.aiAssistanceUsed,
  ).length;
  const incorrectWithoutAssistance = examSessionResult?.questions.filter(
    (q) => !q.isCorrect && !q.aiAssistanceUsed,
  ).length;
  const incorrectWithAssistance = examSessionResult?.questions.filter(
    (q) => !q.isCorrect && q.aiAssistanceUsed,
  ).length;
  const totalAiAssistanceUsed = examSessionResult?.questions.filter(
    (q) => q.aiAssistanceUsed,
  ).length;

  const isPassed = examSessionResult?.passingFlag === "Passed";

  if (examSessionResult && examSessionResult.status !== "Completed") {
    return (
      <div className="bg-accent flex h-full min-h-screen w-full flex-col items-center p-4 md:py-10">
        <div className="border-primary/20 bg-background mx-5 flex w-full max-w-3xl flex-col gap-y-2 overflow-hidden rounded-lg border p-6 text-center md:mx-auto">
          {/* Pending Review Card */}
          <div className="border-primary/20 flex flex-col items-start rounded-lg border">
            <div className="flex w-full flex-col items-center justify-center gap-y-4 bg-amber-50 py-6 dark:bg-amber-900">
              <div className="flex flex-col items-center justify-center gap-y-2">
                <h1 className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  Pending Review
                </h1>
                <p className="text-amber-700 dark:text-amber-300">
                  Your exam is being reviewed
                </p>
              </div>
              <div className="w-full px-5">
                <Progress
                  value={100}
                  className="w-full"
                  indicatorClassName="bg-amber-500"
                />
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Results will be available once the review is complete
              </p>
            </div>

            {/* Details */}
            <div className="flex w-full flex-col gap-y-4 p-8">
              <div className="flex w-full flex-row items-center justify-between">
                <p className="text-muted-foreground">Exam Title</p>
                <p className="font-bold">{examSessionResult?.examTitle}</p>
              </div>

              <div className="flex w-full flex-row items-center justify-between">
                <p className="text-muted-foreground">Submitted At</p>
                <p className="font-bold">
                  {examSessionResult?.finishedAt
                    ? formatUTCDate(examSessionResult?.finishedAt, "en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Not available"}
                </p>
              </div>
              {examSessionResult?.timeSpentSeconds && (
                <div className="flex w-full flex-row items-center justify-between">
                  <p className="text-muted-foreground">Time Spent</p>
                  <p className="font-bold">
                    {(() => {
                      const totalSeconds =
                        examSessionResult?.timeSpentSeconds || 0;
                      const hours = Math.floor(totalSeconds / 3600);
                      const minutes = Math.floor((totalSeconds % 3600) / 60);
                      const seconds = totalSeconds % 60;
                      return `${hours}h ${minutes} min ${seconds} sec`;
                    })()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Buttons Back to Exam Hub */}
          <div className="flex w-full flex-row items-center justify-center gap-x-2 pt-10">
            <Link href="/dashboard" className="w-full">
              <Button variant="outline" className="w-full">
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <Link
              href={`/exams/${examSessionResult?.examId}`}
              className="w-full"
            >
              <Button className="w-full">
                Go to Exam Page <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-accent flex h-full min-h-screen w-full flex-col items-center p-4 md:py-10">
      <div className="border-primary/20 bg-background mx-5 flex w-full max-w-3xl flex-col gap-y-2 overflow-hidden rounded-lg border p-6 text-center md:mx-auto">
        {/* Exam Results */}
        <div className="border-primary/20 flex flex-col items-start rounded-lg border">
          <div
            className={cn(
              "flex w-full flex-col items-center justify-center gap-y-4 bg-lime-50 py-6 dark:bg-lime-900",
              isPassed && "bg-lime-50 dark:bg-lime-900",
              !isPassed && "bg-red-50 dark:bg-red-900",
            )}
          >
            <div className="flex flex-col items-center justify-center gap-y-2">
              <h1
                className={cn(
                  "text-3xl font-bold",
                  isPassed && "text-green-500",
                  !isPassed && "text-red-500",
                )}
              >
                {percentage.toFixed(2)}%
              </h1>
              <p>Your score ({isPassed ? "Passed" : "Failed"})</p>
            </div>
            <div className="w-full px-5">
              <Progress
                value={percentage}
                className="w-full"
                indicatorClassName={cn(
                  "bg-green-500",
                  isPassed && "bg-green-500",
                  !isPassed && "bg-red-500",
                )}
              />
            </div>
            <p className="text-sm">
              Passing Score: {examSessionResult?.passingScore}%
            </p>
          </div>

          {/* Details */}
          <div className="flex w-full flex-col gap-y-4 p-8">
            <div className="flex w-full flex-row items-center justify-between">
              <p className="text-muted-foreground">Exam Title</p>
              <p className="font-bold">{examSessionResult?.examTitle}</p>
            </div>
            <div className="flex w-full flex-row items-center justify-between">
              <p className="text-muted-foreground">Score</p>
              <p className="font-bold">
                {examSessionResult?.score} out of{" "}
                {examSessionResult?.totalScore} ({percentage.toFixed(2)}%)
              </p>
            </div>

            <div className="flex w-full flex-row items-center justify-between">
              <p className="text-muted-foreground">Completion Time</p>
              <p className="font-bold">
                {(() => {
                  const totalSeconds = examSessionResult?.timeSpentSeconds || 0;
                  const hours = Math.floor(totalSeconds / 3600);
                  const minutes = Math.floor((totalSeconds % 3600) / 60);
                  const seconds = totalSeconds % 60;
                  return `${hours}h ${minutes} min ${seconds} sec`;
                })()}
              </p>
            </div>
            <div className="flex w-full flex-row items-center justify-between">
              <p className="text-muted-foreground">Date Completed</p>
              <p className="font-bold">
                {formatUTCDate(examSessionResult?.finishedAt || "", "en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="border-primary/20 flex w-full flex-col gap-y-4 rounded-lg border p-0">
          <div className="flex flex-col items-start gap-y-4 px-8 py-4">
            <h1 className="text-lg font-bold">Performance Breakdown</h1>
            <div className="grid w-full grid-cols-1 gap-4 pb-4 md:grid-cols-2">
              {/* Correct without Assistance */}
              <div className="flex w-full flex-col items-start justify-center gap-y-2 rounded-lg border border-green-500 bg-green-50 p-4">
                <h2 className="text-muted-foreground text-sm font-light">
                  Correct without Assistance
                </h2>
                <p className="text-lg font-bold">{correctWithoutAssistance}</p>
              </div>

              {/* Correct with Assistance */}
              <div className="flex w-full flex-col items-start justify-center gap-y-2 rounded-lg border border-blue-500 bg-blue-50 p-4">
                <h2 className="text-muted-foreground text-sm font-light">
                  Correct with Assistance
                </h2>
                <p className="text-lg font-bold">{correctWithAssistance}</p>
              </div>

              {/* Incorrect without Assistance */}
              <div className="flex w-full flex-col items-start justify-center gap-y-2 rounded-lg border border-red-500 bg-red-50 p-4">
                <h2 className="text-muted-foreground text-sm font-light">
                  Incorrect without Assistance
                </h2>
                <p className="text-lg font-bold">
                  {incorrectWithoutAssistance}
                </p>
              </div>

              {/* Incorrect with Assistance */}
              <div className="flex w-full flex-col items-start justify-center gap-y-2 rounded-lg border border-orange-500 bg-orange-50 p-4">
                <h2 className="text-muted-foreground text-sm font-light">
                  Incorrect with Assistance
                </h2>
                <p className="text-lg font-bold">{incorrectWithAssistance}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Options */}
        {(practiceOptions?.isFullRetakeAvailable ||
          practiceOptions?.isMissedQuestionsRetakeAvailable ||
          practiceOptions?.isAssistedQuestionsRetakeAvailable) && (
          <div className="border-primary/20 flex w-full flex-col gap-y-4 rounded-lg border p-0">
            <div className="flex flex-col items-start px-8 py-4">
              <h1 className="text-lg font-bold">Practice Options</h1>
            </div>
            <div className="flex w-full flex-col gap-y-4 px-8 pb-8">
              {/* Retake Full Exam */}
              {practiceOptions?.isFullRetakeAvailable && (
                <Button
                  variant="outline"
                  className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-slate-400 p-6 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 md:flex-row dark:border-slate-600 dark:hover:bg-slate-900"
                  onClick={() =>
                    handleRetakeExamSession(RetakeOptions.FullRetake)
                  }
                  disabled={isPending}
                >
                  <div className="rounded-full bg-slate-800 p-2 dark:bg-slate-200">
                    <RotateCcwIcon className="text-background h-6 w-6" />
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-lg font-semibold">Retake Full Exam</h3>
                    <p className="text-sm">Start fresh with all questions</p>
                  </div>
                </Button>
              )}

              {/* Practice Missed Questions */}
              {practiceOptions?.isMissedQuestionsRetakeAvailable && (
                <Button
                  variant="outline"
                  className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-orange-400 bg-white p-6 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50 md:flex-row dark:bg-slate-950 dark:hover:bg-orange-950/20"
                  onClick={() =>
                    handleRetakeExamSession(RetakeOptions.MissedQuestionsRetake)
                  }
                  disabled={isPending}
                >
                  <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/30">
                    <XIcon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                      Practice Missed Questions
                    </h3>
                    <p className="text-sm text-orange-500 dark:text-orange-300">
                      Focus on questions you answered incorrectly
                    </p>
                  </div>
                </Button>
              )}

              {/* Practice Assisted Questions */}
              {practiceOptions?.isAssistedQuestionsRetakeAvailable && (
                <Button
                  variant="outline"
                  className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-purple-400 bg-white p-6 hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50 md:flex-row dark:bg-slate-950 dark:hover:bg-purple-950/20"
                  onClick={() =>
                    handleRetakeExamSession(RetakeOptions.AiAssistedRetake)
                  }
                  disabled={isPending}
                >
                  <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/30">
                    <LightBulbIcon className="h-6 w-6 text-purple-500" />
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                      Practice Assisted Questions
                    </h3>
                    <p className="text-sm text-purple-500 dark:text-purple-300">
                      Review questions where you needed help
                    </p>
                  </div>
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Question Results */}
        <div className="border-primary/20 flex w-full flex-col gap-y-4 rounded-lg border p-0">
          <div className="flex flex-col items-start px-8 py-4">
            <h1 className="text-lg font-bold">Question Results</h1>
            <p className="text-muted-foreground text-sm">
              Click on a question to see detailed feedback
            </p>
          </div>
          <div className="flex w-full flex-col gap-y-4">
            <Accordion
              type="multiple"
              className="w-full border-t"
              defaultValue={examSessionResult?.questions.map((q) => q.id) || []}
            >
              {examSessionResult?.questions.map((question, index) => (
                <QuestionResult
                  key={question.id}
                  question={question}
                  index={index}
                />
              ))}
            </Accordion>
          </div>
        </div>
        {/* Buttons Back to Exam Hub */}
        <div className="flex w-full flex-row items-center justify-center gap-x-2 pt-10">
          <Link href="/dashboard" className="w-full">
            <Button variant="outline" className="w-full">
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Link href={`/exams/${examSessionResult?.examId}`} className="w-full">
            <Button className="w-full">
              Go to Exam Page <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
