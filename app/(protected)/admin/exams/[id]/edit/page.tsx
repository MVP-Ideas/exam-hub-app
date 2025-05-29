"use client";

import { useState, useEffect } from "react";
import ExamForm from "@/components/admin/exams/create/exam-form";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import useExamById from "@/hooks/exams/useExamById";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils/exam";
import { Skeleton } from "@/components/ui/skeleton";

const sections = [
  { id: "exam-details", label: "Details" },
  { id: "exam-study-resources", label: "Resources" },
  { id: "exam-questions", label: "Questions" },
  { id: "exam-settings", label: "Settings" },
];

export default function Page() {
  const params = useParams();
  const { id } = params;

  const { exam, isLoading, isError } = useExamById(id as string);

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

      {/* Sticky Navigator on large screens */}
      <div className="hidden lg:sticky lg:top-10 lg:block lg:min-w-[100px] lg:self-start">
        <Navigator />
      </div>
    </div>
  );
}

function Navigator() {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { threshold: 0.4 },
    );

    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as Element[];

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="bg-background rounded-lg border p-4 shadow-sm">
      <p className="text-muted-foreground mb-3 text-sm font-bold tracking-wide uppercase">
        Jump to
      </p>
      <ul className="space-y-2 text-sm">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={cn(
                "hover:bg-muted block rounded-md px-3 py-1 transition-colors",
                activeId === id
                  ? "bg-muted text-primary font-semibold"
                  : "text-muted-foreground",
              )}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
