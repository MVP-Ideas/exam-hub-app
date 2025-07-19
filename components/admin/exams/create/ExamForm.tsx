"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import ExamDetails from "./ExamDetails";
import ExamStudyResources from "./ExamStudyResources";
import ExamQuestions from "./exam-questions/ExamQuestions";
import ExamSettings from "./ExamSettings";
import useCreateExam from "@/hooks/exams/useCreateExam";
import {
  ExamResponse,
  CreateExamRequest as CreateExamRequest,
} from "@/lib/types/exam";
import { useEffect, useState } from "react";
import useUpdateExam from "@/hooks/exams/useUpdateExam";

export const questionSchema = z.object({
  questionId: z.string(),
  points: z.number().min(1, "Points must be at least 1"),
});

export const settingsSchema = z.object({
  resultsImmediately: z.boolean(),
  randomizeQuestions: z.boolean(),
  showCalculator: z.boolean(),
  showExamResourcesDuringSession: z.boolean(),
  showQuestionResourcesDuringSession: z.boolean(),
  showQuestionPoints: z.boolean(),
  showQuestionExplanations: z.boolean(),
  enableAiPoweredExplanations: z.boolean(),
  enableAiRewriteQuestions: z.boolean(),
  enableHints: z.boolean(),
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
  categoryIds: z.array(z.string()).optional(),
  difficulty: z.string().nonempty("Difficulty is required"),
  timeLimit: z
    .number({ invalid_type_error: "Time Limit must be a number" })
    .min(1, "Time Limit must be at least 1 minute")
    .nullable(),
  passingScore: z.number().min(0, "Passing Score must be at least 0%"),
  resourceIds: z.array(z.string()).optional(),
  questions: z.array(questionSchema).optional(),
  settings: settingsSchema,
});

export type ExamFormSchema = z.infer<typeof createExamSchema>;

type Props = {
  type: "edit" | "create";
  exam?: ExamResponse;
};

export default function ExamForm({ type, exam }: Props) {
  const router = useRouter();
  const { createExam, isPending: isCreatePending } = useCreateExam();
  const { updateExam, isPending: isUpdatePending } = useUpdateExam(
    exam?.id as string,
  );
  const [isDraft, setIsDraft] = useState(true);
  const isPending = type === "edit" ? isUpdatePending : isCreatePending;
  console.log(exam);

  const form = useForm<ExamFormSchema>({
    resolver: zodResolver(createExamSchema),
    defaultValues: {
      title: "New Exam",
      description: "",
      categoryIds: [],
      difficulty: "Beginner",
      timeLimit: 60,
      passingScore: 70,
      resourceIds: [],
      questions: [],
      settings: {
        resultsImmediately: true,
        randomizeQuestions: true,
        showCalculator: false,
        showQuestionPoints: true,
        showQuestionExplanations: true,
        showExamResourcesDuringSession: false,
        showQuestionResourcesDuringSession: false,
        enableAiPoweredExplanations: false,
        enableAiRewriteQuestions: false,
        enableHints: false,
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
      const examCreate: CreateExamRequest = {
        title: data.title,
        description: data.description,
        categoryIds: data.categoryIds ?? [],
        difficulty: data.difficulty,
        durationSeconds: data.timeLimit ? data.timeLimit * 60 : undefined,
        passingScore: data.passingScore,
        resourceIds: data.resourceIds ?? [],
        questions:
          data.questions !== undefined
            ? data.questions.map((q) => ({
                questionId: q.questionId,
                points: q.points,
              }))
            : [],
        settings: {
          resultsImmediately: data.settings.resultsImmediately,
          randomizeQuestions: data.settings.randomizeQuestions,
          showCalculator: data.settings.showCalculator,
          showExamResourcesDuringSession:
            data.settings.showExamResourcesDuringSession,
          showQuestionResourcesDuringSession:
            data.settings.showQuestionResourcesDuringSession,
          showQuestionPoints: data.settings.showQuestionPoints,
          showQuestionExplanations: data.settings.showQuestionExplanations,
          enableAiPoweredExplanations:
            data.settings.enableAiPoweredExplanations,
          enableAiRewriteQuestions: data.settings.enableAiRewriteQuestions,
          enableHints: data.settings.enableHints,
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
        categoryIds: exam.categories.map((category) => category.id),
        difficulty: exam.difficulty,
        timeLimit:
          exam.durationSeconds > 0
            ? Math.floor(exam.durationSeconds / 60)
            : null,
        passingScore: exam.passingScore,
        resourceIds: exam.resources.map((resource) => resource.id),
        questions: exam.questions ?? [],
        settings: {
          resultsImmediately: exam.settings?.resultsImmediately ?? false,
          randomizeQuestions: exam.settings?.randomizeQuestions ?? false,
          showCalculator: exam.settings?.showCalculator ?? false,
          showExamResourcesDuringSession:
            exam.settings?.showExamResourcesDuringSession ?? false,
          showQuestionResourcesDuringSession:
            exam.settings?.showQuestionResourcesDuringSession ?? false,
          showQuestionPoints: exam.settings?.showQuestionPoints ?? false,
          showQuestionExplanations:
            exam.settings?.showQuestionExplanations ?? false,
          enableAiPoweredExplanations:
            exam.settings?.enableAiPoweredExplanations ?? false,
          enableAiRewriteQuestions:
            exam.settings?.enableAiRewriteQuestions ?? false,
          enableHints: exam.settings?.enableHints ?? false,
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

          <div className="mt-6 flex w-full flex-col items-center justify-between gap-y-4 md:hidden">
            <Button
              type="button"
              variant="ghost"
              className="border-primary/20 w-full border px-6"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="ghost"
              className="border-primary/20 w-full border px-6"
              disabled={isPending}
              onClick={() => setIsDraft(true)}
            >
              Save as Draft
            </Button>
            <Button
              hidden={!questions || questions.length === 0}
              type="submit"
              variant="default"
              className="border-primary/20 w-full border px-6"
              disabled={isPending}
              onClick={() => setIsDraft(false)}
            >
              <SaveIcon className="mr-2" />
              Save and Publish
            </Button>
          </div>

          <div className="mt-6 hidden flex-row items-center justify-between md:flex">
            <Button
              type="button"
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
