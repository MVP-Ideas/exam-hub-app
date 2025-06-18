"use client";

import { Progress } from "@/components/ui/progress";
import useExamSessionResult from "@/hooks/exam-sessions/useExamSessionResult";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatUTCDate } from "@/lib/date-utils";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AppLoader from "@/components/common/app-loader";
import { QuestionResult } from "@/components/learner/results/question-result";

export default function Page() {
  const { id } = useParams();
  const { examSessionResult, isLoading, isError } = useExamSessionResult(
    id as string,
  );

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
