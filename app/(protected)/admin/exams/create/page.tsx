"use client";

import { useState, useEffect } from "react";
import ExamForm from "@/components/admin/exams/create/exam-form";
import { cn } from "@/lib/utils";

const sections = [
  { id: "exam-details", label: "Details" },
  { id: "exam-study-resources", label: "Resources" },
  { id: "exam-questions", label: "Questions" },
  { id: "exam-settings", label: "Settings" },
];

export default function Page() {
  return (
    <div className="flex w-full justify-center p-10 lg:items-start lg:gap-4">
      <div className="flex w-full max-w-5xl flex-col gap-6">
        <header>
          <h1 className="text-2xl font-bold">Create New Exam</h1>
          <p className="text-sm">
            Set up exam details, add questions, and configure settings.
          </p>
        </header>

        <ExamForm type="create" />
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
