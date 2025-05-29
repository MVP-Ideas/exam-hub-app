"use client";

import { Progress } from "@/components/ui/progress";
import useExamSessionResult from "@/hooks/exam-sessions/useExamSessionResult";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatUTCDate } from "@/lib/date-utils";
import { ExamSessionQuestionResultResponse } from "@/lib/types/exam-session";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { QuestionType } from "@/lib/types/questions";
import AppLoader from "@/components/common/app-loader";

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
  const correctAnswerCount = examSessionResult?.questions.filter(
    (question) => question.answer?.isCorrect,
  ).length;

  return (
    <div className="bg-accent flex h-full min-h-screen w-full flex-col items-center py-10">
      <div className="border-primary/20 bg-background mx-5 flex w-full max-w-3xl flex-col gap-y-2 overflow-hidden rounded-lg border p-6 text-center md:mx-0">
        {/* Exam Details */}
        <div className="flex flex-col items-start">
          <p className="text-sm">Exam Details</p>
          <h1 className="text-xl font-bold">{examSessionResult?.examTitle}</h1>
        </div>

        {/* Exam Results */}
        <div className="border-primary/20 flex flex-col items-start rounded-lg border">
          <div
            className={cn(
              "flex w-full flex-col items-center justify-center gap-y-4 bg-lime-50 py-6",
              isPassed && "bg-lime-50",
              !isPassed && "bg-red-50",
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
              <p className="text-muted-foreground">Correct Answers</p>
              <p className="font-bold">
                {correctAnswerCount} out of{" "}
                {examSessionResult?.questions.length}
              </p>
            </div>
            <div className="flex w-full flex-row items-center justify-between">
              <p className="text-muted-foreground">Completion Time</p>
              <p className="font-bold">
                {examSessionResult?.timeSpentSeconds
                  ? Math.floor(examSessionResult?.timeSpentSeconds / 60)
                  : 0}{" "}
                minutes
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
            <Accordion type="multiple" className="w-full border-t">
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
            <Button variant="secondary" className="w-full">
              Go to Exam Page <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function QuestionResult({
  question,
  index,
}: {
  question: ExamSessionQuestionResultResponse;
  index: number;
}) {
  const getQuestionTypeText = (isCorrect: boolean, text: string) => {
    return (
      <p
        className={cn(
          `text-start text-lg font-bold`,
          isCorrect ? "text-green-500" : "text-red-500",
        )}
      >
        {text}
      </p>
    );
  };

  return (
    <AccordionItem
      value={question.id}
      className="border-t-primary/20 w-full flex-row gap-y-4"
    >
      <AccordionTrigger className="flex w-full flex-row items-center justify-between px-8">
        <div className="flex h-full flex-col items-center p-0">
          {question.answer?.isCorrect ? (
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
          ) : (
            <XCircleIcon className="h-6 w-6 text-red-500" />
          )}
        </div>
        <div className="flex w-full flex-col items-start">
          <p className="w-full text-base font-bold">Question {index + 1}</p>
          <p className="text-muted-foreground text-sm">{question.text}</p>
        </div>
      </AccordionTrigger>
      <AccordionContent className="bg-accent flex w-full flex-col items-start px-8 py-4">
        <div className="flex flex-col items-start gap-y-4 pl-10">
          <div className="flex flex-col items-start">
            <p className="text-muted-foreground text-sm">Your Answer</p>
            {(() => {
              if (
                question.type === QuestionType.MultipleChoiceSingle ||
                question.type === QuestionType.TrueFalse
              ) {
                return (
                  <div>
                    {question.answer?.choices.map((choice) => (
                      <div key={choice.questionChoiceId}>
                        {getQuestionTypeText(
                          question.answer?.isCorrect || false,
                          choice.text || "",
                        )}
                      </div>
                    ))}
                  </div>
                );
              } else if (
                question.type === QuestionType.MultipleChoiceMultiple
              ) {
                return (
                  <ul className="list-disc pl-4">
                    {question.answer?.choices.map((choice) => (
                      <li key={choice.questionChoiceId}>
                        {getQuestionTypeText(
                          question.answer?.isCorrect || false,
                          choice.text || "",
                        )}
                      </li>
                    ))}
                  </ul>
                );
              } else if (question.type === QuestionType.DragAndDrop) {
                return (
                  <ol className="list-decimal pl-4">
                    {question.answer?.choices.map((choice) => (
                      <li key={choice.questionChoiceId}>
                        {getQuestionTypeText(
                          question.answer?.isCorrect || false,
                          choice.text || "",
                        )}
                      </li>
                    ))}
                  </ol>
                );
              }
              return null;
            })()}
          </div>

          {!question.answer?.isCorrect && (
            <div className="flex flex-col items-start">
              <p className="text-muted-foreground text-sm">Correct Answer</p>
              {(() => {
                if (
                  question.type === QuestionType.MultipleChoiceSingle ||
                  question.type === QuestionType.TrueFalse
                ) {
                  return (
                    <div>
                      {question?.correctChoices.map((choice) => (
                        <div key={choice.id}>
                          {getQuestionTypeText(true, choice.text || "")}
                        </div>
                      ))}
                    </div>
                  );
                } else if (
                  question.type === QuestionType.MultipleChoiceMultiple
                ) {
                  return (
                    <ul className="list-disc pl-4">
                      {question?.correctChoices.map((choice) => (
                        <li key={choice.id}>
                          {getQuestionTypeText(true, choice.text || "")}
                        </li>
                      ))}
                    </ul>
                  );
                } else if (question.type === QuestionType.DragAndDrop) {
                  return (
                    <ol className="list-decimal pl-4">
                      {question?.correctChoices
                        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                        .map((choice) => (
                          <li key={choice.id}>
                            {getQuestionTypeText(true, choice.text || "")}
                          </li>
                        ))}
                    </ol>
                  );
                }
                return null;
              })()}
            </div>
          )}

          {/* Explanation */}
          <div className="flex flex-col items-start gap-y-2">
            <p className="text-muted-foreground text-sm">Explanation</p>
            <div className="border-primary/20 flex flex-col items-start rounded-lg border bg-blue-50 p-2">
              <p className="text-primary text-sm">{question.explanation}</p>
            </div>
          </div>
        </div>
      </AccordionContent>

      <div className="flex flex-col items-start"></div>
    </AccordionItem>
  );
}
