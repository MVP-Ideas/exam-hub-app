"use client";

import ExamForm from "@/components/admin/exams/create/ExamForm";
import { useParams } from "next/navigation";
import useExamById from "@/hooks/exams/useExamById";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils/exam";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const params = useParams();
  const { id } = params;

  const { exam, isLoading, isError } = useExamById(id as string, false);

  console.log("Edit Page", exam);

  return (
    <div className="flex w-full justify-center lg:items-start lg:gap-4">
      <div className="flex w-full max-w-5xl flex-col gap-6 p-6 lg:p-10">
        <header>
          <div className="flex flex-row items-center gap-2">
            <h1 className="text-2xl font-bold">Edit Exam</h1>
            <Badge
              variant="outline"
              className={`border-0 ${getStatusColor(exam?.status as string)}`}
            >
              {exam?.status}
            </Badge>
            <span className="text-muted-foreground text-xs">
              v{exam?.version}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            Update exam details, add questions, and configure settings.
          </p>
        </header>

        {!isLoading && !isError && exam ? (
          <ExamForm exam={exam} type="edit" />
        ) : !isError ? (
          <div className="flex h-full w-full items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-destructive">Error loading exam data</p>
          </div>
        )}
      </div>
    </div>
  );
}
