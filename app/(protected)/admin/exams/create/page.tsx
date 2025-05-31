"use client";

import ExamForm from "@/components/admin/exams/create/exam-form";

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
    </div>
  );
}
