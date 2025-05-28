"use client";
import { Button } from "@/components/ui/button";
import useExamSessionById from "@/hooks/exam-sessions/useExamSessionById";
import {
  BookOpenIcon,
  CalendarIcon,
  CheckCircleIcon,
  TimerIcon,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useParams } from "next/navigation";
import { formatUTCDate } from "../../../../../../lib/date-utils";
import { useEffect } from "react";
import Link from "next/link";

export default function Page() {
  const { id } = useParams();
  const { examSession, isLoading, isError } = useExamSessionById(id as string);

  useEffect(() => {
    if (examSession && !isLoading && !isError) {
      const duration = 2000; // in ms
      const animationEnd = Date.now() + duration;
      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        confetti({
          particleCount: 20,
          startVelocity: 30,
          spread: 70,
          origin: { x: Math.random(), y: Math.random() * 0.6 },
        });
      }, 250); // fire every 250ms
    }
  }, [examSession, isLoading, isError]);

  return (
    <div className="flex h-full w-full items-center justify-center py-10 md:h-screen">
      <div className="mx-5 flex w-full max-w-2xl flex-col items-center justify-center gap-y-2 overflow-hidden rounded-lg border text-center md:mx-0">
        {/* Success */}
        <div className="flex w-full flex-col items-center justify-center gap-y-5 bg-lime-50 py-20">
          <div className="flex items-center justify-center rounded-full bg-green-200 p-2">
            <CheckCircleIcon className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-green-500">
            Exam submitted successfully!
          </h2>
        </div>
        {/* Details */}
        <div className="flex w-full flex-col items-start gap-y-5 px-6 py-6">
          <h2 className="text-base font-bold">Exam Details</h2>
          <div className="grid w-full grid-cols-2 items-center justify-center gap-x-5 gap-y-4">
            <div className="flex flex-row items-center gap-x-4">
              <BookOpenIcon className="h-6 w-6" />
              <div className="flex flex-col items-start justify-center">
                <p className="text-sm font-light">Exam Name</p>
                <p className="text-base font-bold">{examSession?.exam.title}</p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-x-4">
              <CalendarIcon className="h-6 w-6" />
              <div className="flex flex-col items-start justify-center">
                <p className="text-sm font-light">Completed On</p>
                <p className="text-base font-bold">
                  {formatUTCDate(examSession?.finishedAt ?? "")}
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-x-4">
              <TimerIcon className="h-6 w-6" />
              <div className="flex flex-col items-start justify-center">
                <p className="text-sm font-light">Time Spent</p>
                <p className="text-base font-bold">
                  {examSession?.timeSpentSeconds
                    ? Math.floor(examSession?.timeSpentSeconds / 60)
                    : 0}{" "}
                  min
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-x-4">
              <CheckCircleIcon className="h-6 w-6" />
              <div className="flex flex-col items-start justify-center">
                <p className="text-sm font-light">Questions Completed</p>
                <p className="text-base font-bold">
                  {
                    examSession?.questions.filter(
                      (question) => question.answer != null,
                    ).length
                  }{" "}
                  out of {examSession?.questions.length}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* What happens next */}
        <div className="flex w-full flex-col items-start gap-y-5 px-6 py-6">
          <div className="bg-primary/5 border-primary/20 text-primary flex w-full flex-col items-start gap-y-5 rounded-lg border p-6">
            <h1 className="text-lg font-bold">What Happens Next?</h1>
            <p className="text-sm font-light">
              Your exam has been submitted successfully. You can:
            </p>
            <ul className="flex list-disc flex-col items-start gap-y-1 pl-5 text-sm">
              <li>Review your results to see how you performed</li>
              <li>See detailed feedback on each question</li>
              <li>Identify areas for improvement</li>
              <li>Retake the exam if needed</li>
            </ul>
          </div>
        </div>
        {/* Buttons */}

        <div className="w-full px-6 py-6">
          <div className="mx-auto flex max-w-xl flex-col justify-center gap-y-4 md:flex-row md:gap-x-4">
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                Back to Exam Hub
              </Button>
            </Link>
            <Link href={`/results/${examSession?.id}`} className="w-full">
              <Button className="w-full">View Results</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
