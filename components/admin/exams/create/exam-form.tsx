"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import ExamDetails from "./exam-details";
import ExamStudyResources from "./exam-study-resources";
import ExamQuestions from "./exam-questions/exam-questions";
import ExamSettings from "./exam-settings";
import useCreateExam from "@/hooks/exams/useCreateExam";
import { Exam, ExamCreateUpdate as ExamCreateUpdate } from "@/lib/types/exam";
import { useEffect, useState } from "react";
import useUpdateExam from "@/hooks/exams/useUpdateExam";

export const questionSchema = z.object({
  questionId: z.string(),
  points: z.number().min(1, "Points must be at least 1"),
});

export const settingsSchema = z.object({
  timeLimitEnabled: z.boolean(),
  resultsImmediately: z.boolean(),
  randomizeQuestions: z.boolean(),
});

export const resourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(["File", "Url"]),
  value: z.string(),
});

export const createExamSchema = z.object({
  title: z.string().min(1, "Title is required").max(50),
  description: z.string().min(10, "At least 10 characters").max(500),
  categoryId: z.string(),
  difficulty: z.string().nonempty("Difficulty is required"),
  timeLimit: z
    .number({ invalid_type_error: "Time Limit must be a number" })
    .min(1, "Time Limit must be at least 1 minute"),
  passingScore: z.number().min(0, "Passing Score must be at least 0%"),
  resources: z.array(resourceSchema).optional(),
  questions: z.array(questionSchema).optional(),
  settings: settingsSchema,
});

export type ExamFormSchema = z.infer<typeof createExamSchema>;

type Props = {
  type: "edit" | "create";
  exam?: Exam;
};

export default function ExamForm({ type, exam }: Props) {
  const router = useRouter();
  const { createExam, isPending: isCreatePending } = useCreateExam();
  const { updateExam, isPending: isUpdatePending } = useUpdateExam(
    exam?.id as string,
  );
  const [isDraft, setIsDraft] = useState(true);
  const isPending = type === "edit" ? isUpdatePending : isCreatePending;

  const form = useForm<ExamFormSchema>({
    resolver: zodResolver(createExamSchema),
    defaultValues: {
      title: "New Exam",
      description: "",
      categoryId: "",
      difficulty: "",
      timeLimit: 60,
      passingScore: 70,
      resources: [],
      questions: [],
      settings: {
        timeLimitEnabled: false,
        resultsImmediately: false,
        randomizeQuestions: false,
      },
    },
  });

  const { reset, handleSubmit, watch } = form;

  const questions = watch("questions");

  const onSubmit = async (
    isDraft: boolean,
    data: z.infer<typeof createExamSchema>,
  ) => {
    try {
      const examCreate: ExamCreateUpdate = {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        difficulty: data.difficulty,
        durationSeconds: data.timeLimit * 60,
        passingScore: data.passingScore,
        resources: data.resources?.map((resource) => resource.id) ?? [],
        questions:
          data.questions !== undefined
            ? data.questions.map((q) => ({
                questionId: q.questionId,
                points: q.points,
              }))
            : [],
        settings: {
          timeLimitEnabled: data.settings.timeLimitEnabled,
          resultsImmediately: data.settings.resultsImmediately,
          randomizeQuestions: data.settings.randomizeQuestions,
        },
        isDraft: isDraft,
      };

      const response =
        type === "edit"
          ? await updateExam(examCreate)
          : await createExam(examCreate);

      if (response) {
        reset();
        router.push("/admin/exams");
      }
    } catch (error) {
      console.error("Error creating exam:", error);
    }
  };

  const onCancel = () => {
    reset();
    router.back();
  };

  useEffect(() => {
    if (type === "edit" && exam) {
      reset({
        title: exam.title,
        description: exam.description,
        categoryId: exam.category,
        difficulty: exam.difficulty,
        timeLimit: Math.floor(exam.durationSeconds / 60),
        passingScore: exam.passingScore,
        resources: exam.resources ?? [],
        questions: exam.questions ?? [],
        settings: {
          timeLimitEnabled: exam.settings?.timeLimitEnabled ?? false,
          resultsImmediately: exam.settings?.resultsImmediately ?? false,
          randomizeQuestions: exam.settings?.randomizeQuestions ?? false,
        },
      });
    }
  }, [type, exam, reset]);

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form
          onSubmit={handleSubmit((data) => onSubmit(isDraft, data))}
          className="space-y-2"
        >
          {/* Exam Details */}
          <ExamDetails disabled={isPending} />

          {/* Study Resources */}
          <ExamStudyResources disabled={isPending} />

          {/* Questions */}
          <ExamQuestions disabled={isPending} />

          {/* Exam Settings */}
          <ExamSettings disabled={isPending} />

          <div className="mt-6 flex flex-row items-center justify-between">
            <Button
              type="submit"
              variant="ghost"
              className="border-primary/20 border px-6"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <div className="flex flex-row items-center space-x-4">
              <Button
                type="submit"
                variant="ghost"
                className="border-primary/20 border px-6"
                disabled={isPending}
                onClick={() => setIsDraft(true)}
              >
                Save as Draft
              </Button>
              <Button
                hidden={!questions || questions.length === 0}
                type="submit"
                variant="default"
                className="border-primary/20 border px-6"
                disabled={isPending}
                onClick={() => setIsDraft(false)}
              >
                <SaveIcon className="mr-2" />
                Save and Publish
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
