"use client";

import ExamSessionToolbar from "@/components/learner/exam-session/exam-session-toolbar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowLeft, ArrowRight, Menu, TimerIcon } from "lucide-react";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();

  return (
    <div className="flex h-full w-full flex-row">
      <ExamSessionToolbar answers={[]} />
      <div className="flex h-full w-full flex-col">
        <header className="flex w-full flex-row items-center justify-between p-4">
          <div className="flex flex-row items-center gap-x-2">
            <SidebarTrigger icon={<Menu />} />
            <div className="flex flex-col">
              <h2 className="truncate font-bold">
                Microsoft Azure Fundamentals
              </h2>
              <p className="text-muted-foreground text-xs">
                Certification Exam
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
        <div className="bg-muted flex flex-1 flex-col">
          <div className="flex h-full w-full flex-col items-center justify-center">
            <h2 className="text-lg font-bold">Question 1</h2>
            <p className="text-muted-foreground text-sm">
              This is a sample question text.
            </p>
          </div>
        </div>
        {/* Footer */}

        <footer className="flex w-full flex-row items-center justify-between p-4">
          <Button variant="outline" className="px-4 font-semibold">
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button variant="secondary" className="px-4 font-semibold">
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        </footer>
      </div>
    </div>
  );
}
