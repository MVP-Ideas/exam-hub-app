"use client";

import useExamSessionResult from "@/hooks/exam-sessions/useExamSessionResult";
import { ArrowLeftIcon, ArrowRightIcon, TimerReset } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { formatUTCDate } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AppLoader from "@/components/common/app-loader";
import { QuestionReview } from "@/components/learner/results/question-review";
import { Skeleton } from "@/components/ui/skeleton";
import useUpdateQuestionPoints from "@/hooks/exam-sessions/useUpdateQuestionPoints";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useCompleteReview from "@/hooks/exam-sessions/useCompleteReview";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { examSessionResult, isLoading, isError } = useExamSessionResult(
    id as string,
  );
  const [questionPoints, setQuestionPoints] = useState<
    {
      questionId: string;
      points: number;
    }[]
  >([]);
  const { updateQuestionPoints, isPending: isUpdatingPoints } =
    useUpdateQuestionPoints(id as string);
  const { completeReview, isPending: isCompletingReview } = useCompleteReview(
    id as string,
  );

  useEffect(() => {
    if (!examSessionResult) return;

    if (examSessionResult.status !== "ToBeReviewed") {
      router.push(`/admin/exams/sessions/results/${id}`);
      return;
    }
    if (examSessionResult) {
      const points = examSessionResult.questions.map((question) => ({
        questionId: question.id,
        points: question.points || 0,
      }));
      setQuestionPoints(points);
    }
  }, [examSessionResult, id, router]);

  if (isLoading || isError || !examSessionResult) {
    return (
      <div className="flex h-screen w-full items-center justify-center py-10">
        <AppLoader />
      </div>
    );
  }

  if (examSessionResult.status !== "ToBeReviewed") {
    return (
      <div className="flex h-screen w-full items-center justify-center py-10">
        <p className="text-lg font-bold text-red-500">
          This exam session is not in a reviewable state.
        </p>
      </div>
    );
  }

  const questionTotalPoints = questionPoints.reduce(
    (total, { points }) => total + points,
    0,
  );

  const handleFinalizeReview = async (isComplete: boolean) => {
    if (!examSessionResult) return;
    const updatedQuestions = questionPoints.map((q) => ({
      examSessionQuestionId: q.questionId,
      points: q.points,
    }));

    const success = await updateQuestionPoints(updatedQuestions);

    if (success) {
      toast.success("Scores updated successfully!");
    } else {
      toast.error("Failed to finalize review. Please try again.");
    }

    if (isComplete) {
      try {
        await completeReview();
        toast.success("Review completed successfully!");
        router.push(`/admin/exams/sessions/results/${id}`);
      } catch {
        toast.error("Failed to complete review. Please try again.");
      }
    }
  };

  const handleResetReview = () => {
    if (!examSessionResult) return;
    const resetPoints = examSessionResult.questions.map((question) => ({
      questionId: question.id,
      points: question.points || 0,
    }));
    setQuestionPoints(resetPoints);
  };

  const percentage = examSessionResult?.score
    ? (questionTotalPoints / examSessionResult?.totalScore) * 100
    : 0;

  return (
    <div className="bg-accent flex h-full min-h-screen w-full flex-col items-center p-4 md:py-10">
      <div className="border-primary/20 bg-background mx-5 flex w-full max-w-3xl flex-col gap-y-2 overflow-hidden rounded-lg border p-6 text-center md:mx-0">
        {/* Exam Results */}
        <div className="border-primary/20 flex flex-col items-start rounded-lg border">
          {/* Details */}
          <div className="flex w-full flex-col gap-y-4 px-8 py-4">
            <div className="flex flex-col items-start">
              <h1 className="font-bold md:text-lg">Exam Details</h1>
              <p className="text-muted-foreground text-start text-xs md:text-sm">
                The following are the initial details of the exam session.
              </p>
            </div>
            <div className="flex w-full flex-col items-start justify-between md:flex-row md:items-center">
              <p className="text-muted-foreground text-sm md:text-base">User</p>
              <p className="text-start text-sm font-bold md:text-base">
                {examSessionResult?.userName}
              </p>
            </div>
            <div className="flex w-full flex-col items-start justify-between md:flex-row md:items-center">
              <p className="text-muted-foreground text-sm md:text-base">
                Exam Title
              </p>
              <p className="text-sm font-bold md:text-base">
                {examSessionResult?.examTitle}
              </p>
            </div>
            <div className="flex w-full flex-col items-start justify-between md:flex-row md:items-center">
              <p className="text-muted-foreground text-sm md:text-base">
                Score
              </p>
              <p className="text-sm font-bold md:text-base">
                {questionTotalPoints} out of {examSessionResult?.totalScore} (
                {percentage.toFixed(2)}%)
              </p>
            </div>

            <div className="flex w-full flex-col items-start justify-between md:flex-row md:items-center">
              <p className="text-muted-foreground text-sm md:text-base">
                Completion Time
              </p>
              <p className="text-sm font-bold md:text-base">
                {(() => {
                  const totalSeconds = examSessionResult?.timeSpentSeconds || 0;
                  const hours = Math.floor(totalSeconds / 3600);
                  const minutes = Math.floor((totalSeconds % 3600) / 60);
                  const seconds = totalSeconds % 60;
                  return `${hours}h ${minutes} min ${seconds} sec`;
                })()}
              </p>
            </div>
            <div className="flex w-full flex-col items-start justify-between md:flex-row md:items-center">
              <p className="text-muted-foreground text-sm md:text-base">
                Date Completed
              </p>
              <p className="text-sm font-bold md:text-base">
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col items-start px-8 py-4">
              <h1 className="font-bold md:text-lg">Question Results</h1>
              <p className="text-muted-foreground text-start text-xs md:text-sm">
                Review each question and update points as needed
              </p>
            </div>
            <div className="flex w-full items-center justify-between px-8 py-4 md:w-auto">
              <Button
                variant="outline"
                className="text-sm font-bold"
                onClick={handleResetReview}
              >
                Reset Review <TimerReset className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex w-full flex-col gap-y-4">
            {isLoading && !examSessionResult && (
              <div className="flex w-full flex-col items-center justify-center gap-y-4 p-8">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            )}
            {!isLoading && examSessionResult && (
              <div className="w-full">
                {examSessionResult?.questions.map((question, index) => (
                  <QuestionReview
                    key={question.id}
                    question={question}
                    index={index}
                    points={
                      questionPoints.find((q) => q.questionId === question.id)
                        ?.points || 0
                    }
                    setPoints={(points) => {
                      setQuestionPoints((prev) =>
                        prev.map((q) =>
                          q.questionId === question.id ? { ...q, points } : q,
                        ),
                      );
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Buttons Back to Exam Hub */}
        <div className="flex w-full flex-col items-center justify-center gap-x-4 gap-y-4 pt-4 md:flex-row">
          <div className="w-full">
            <Button
              disabled={isUpdatingPoints}
              className="w-full bg-yellow-500 text-white hover:bg-yellow-600"
              onClick={() => handleFinalizeReview(false)}
            >
              Save Result Only
            </Button>
          </div>

          <div className="w-full">
            <Button
              disabled={isUpdatingPoints || isCompletingReview}
              className="w-full bg-green-500 text-white hover:bg-green-600"
              onClick={() => handleFinalizeReview(true)}
            >
              Complete and Finalize Review
            </Button>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-x-4 gap-y-2 pt-4 md:flex-row">
          <Link href="/admin/exams/sessions/reviews" className="w-full">
            <Button variant="outline" className="w-full">
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Pending Reviews
            </Button>
          </Link>
          <Link
            href={`/admin/exams/${examSessionResult?.examId}`}
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
