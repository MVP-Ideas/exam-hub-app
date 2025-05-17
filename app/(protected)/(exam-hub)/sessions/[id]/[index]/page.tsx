"use client";

import ExamSessionToolbar from "@/components/learner/exam-session/exam-session-toolbar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import useExamSessionById from "@/hooks/exam-sessions/useExamSessionById";
import { ArrowLeft, ArrowRight, Menu, TimerIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import QuestionBox from "@/components/learner/exam-session/question-box";

export default function Page() {
  const router = useRouter();
  const { id, index } = useParams();
  const { examSession, isLoading, isError } = useExamSessionById(id as string);
  const questions = examSession?.exam.questions || [];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    parseInt(index as string) || 1,
  );

  useEffect(() => {
    router.push(`/sessions/${id}/${currentQuestionIndex}`);
  }, [id, currentQuestionIndex, router]);

  if ((isLoading || !examSession) && !isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <BeatLoader />
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
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-row">
      <ExamSessionToolbar
        examId={examSession.exam.id}
        questions={questions}
        currentQuestionIndex={currentQuestionIndex - 1}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
      />
      <div className="flex h-full w-full flex-col">
        <header className="flex w-full flex-row items-center justify-between p-4">
          <div className="flex flex-row items-center gap-x-2">
            <SidebarTrigger icon={<Menu />} />
            <div className="flex flex-col">
              <h2 className="truncate font-bold">{examSession.exam.title}</h2>
              <p className="text-muted-foreground text-xs">
                {examSession.exam.category}
              </p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-x-2">
            <TimerIcon className="h-4 w-4" />
            <div className="flex flex-col items-end">
              <p className="text-muted-foreground text-xs">Time Remaining</p>
              <p className="text-lg font-bold">01:30:00</p>
            </div>
          </div>
        </header>
        <Separator />
        {/* Exam Progress Bar */}
        <div className="flex w-full flex-col gap-y-2 px-6 py-4">
          <div className="flex w-full flex-row items-center justify-between">
            <p className="text-muted-foreground text-xs">Exam Progress</p>
            <p className="text-muted-foreground text-xs">0/10 Questions</p>
          </div>
          <Progress />
        </div>
        <Separator />
        {/* Question */}
        <div className="flex flex-1 flex-col">
          <QuestionBox
            questionId={questions[currentQuestionIndex - 1].questionId}
          />
        </div>
        {/* Footer */}
        <footer className="flex w-full flex-row items-center justify-between p-4">
          <Button
            variant="outline"
            className="px-4 font-semibold"
            onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            disabled={currentQuestionIndex === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="secondary"
            className="px-4 font-semibold"
            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
            disabled={currentQuestionIndex === questions.length}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </footer>
      </div>
    </div>
  );
}
