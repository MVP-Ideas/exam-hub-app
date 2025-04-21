"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Edit, Link, Trash2Icon, UploadIcon } from "lucide-react";

import useQuestionById from "@/hooks/questions/useQuestionById";
import DragAndDropEditor from "./choices/question-drag-and-drop-editor";
import TrueFalseEditor from "./choices/question-true-or-false-editor";
import MultipleChoiceSingleEditor from "./choices/question-multiple-choice-single-editor";
import MultipleChoiceMultipleEditor from "./choices/question-multiple-choice-multiple";
import {
  QuestionChoiceCreateUpdate,
  QuestionType,
  QuestionCreateUpdate,
} from "@/lib/types/questions";
import QuestionTypeSelect from "./question-type-select";
import QuestionCategorySelect from "./question-category-select";
import AddLinkDialog from "./modals/add-link-dialog";
import UploadFileDialog from "./modals/upload-file-dialog";
import ResourceCard from "./common/resource-card";
import useUpdateQuestion from "@/hooks/questions/useUpdateQuestion";
import { toast } from "sonner";
import useDeleteQuestion from "@/hooks/questions/useDeleteQuestion";
import ConfirmDeleteDialog from "@/components/common/dialogs/confirm-delete-dialog";
import useCreateQuestion from "@/hooks/questions/useCreateQuestion";

const choiceSchema = z.object({
  text: z.string().min(1, "Choice text is required"),
  isCorrect: z.boolean(),
});

export type ChoiceSchema = z.infer<typeof choiceSchema>;

const schema = z.object({
  text: z.string().min(1, "Question text is required"),
  description: z.string().optional(),
  type: z.nativeEnum(QuestionType),
  categoryId: z.string().optional(),
  choices: z
    .array(choiceSchema)
    .min(1, "At least one choice is required")
    .refine((choices) => choices.some((choice) => choice.isCorrect === true), {
      message: "At least one choice must be marked as correct.",
    }),
  resources: z.array(z.string()).optional(),
});

export type QuestionFormSchema = z.infer<typeof schema>;

type Props = {
  mode: "create" | "edit";
  questionId?: string;
  children?: React.ReactNode;
};

export default function QuestionSheet({ mode, questionId, children }: Props) {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { question, isLoading } = useQuestionById(questionId || "");
  const { createQuestion, isPending: isCreating } = useCreateQuestion();
  const { updateQuestion, isPending: isUpdating } = useUpdateQuestion(
    questionId || "",
  );
  const { deleteQuestion } = useDeleteQuestion(questionId || "");

  const form = useForm<QuestionFormSchema>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { control, handleSubmit, setValue, watch, reset } = form;

  const questionType = watch("type");
  const resources = watch("resources");

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(false);
      setDeleteOpen(false);
      reset();
    } else {
      setOpen(true);
    }
  };

  const onSubmit = async (data: QuestionFormSchema) => {
    const updateChoices: QuestionChoiceCreateUpdate[] = data.choices.map(
      (choice) =>
        ({
          text: choice.text,
          isCorrect: choice.isCorrect,
        }) as QuestionChoiceCreateUpdate,
    );

    const updatedData: QuestionCreateUpdate = {
      text: data.text,
      description: data.description ?? "",
      type: data.type,
      categoryId:
        data.categoryId !== "" && data.categoryId !== undefined
          ? data.categoryId
          : null,
      choices: updateChoices,
      resources: data.resources ?? ([] as string[]),
      aiHelpEnabled: false,
    };

    const response =
      mode === "edit"
        ? await updateQuestion(updatedData)
        : await createQuestion(updatedData);

    if (response) {
      reset();
      setOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!questionId) return;
    try {
      const response = await deleteQuestion();
      if (response) {
        setDeleteOpen(false);
        setOpen(false);
      }
    } catch {
      toast.error("Failed to delete question");
    }
  };

  const handleReset = () => {
    reset({
      text: "",
      description: "",
      type: QuestionType.MultipleChoiceSingle,
      categoryId: "",
      choices: [
        {
          text: "A choice",
          isCorrect: false,
        },
      ],
      resources: [],
    });
  };

  useEffect(() => {
    if (mode === "edit" && question) {
      reset({
        text: question.text,
        description: question.description,
        type: question.type,
        choices: question.choices ?? [],
        categoryId: question.category ?? "",
        resources: question.resources.map((resource) => resource.id),
      });
    }
  }, [mode, question, reset, open]);

  if (isLoading || !question) {
    return (
      <Sheet>
        <SheetContent side="right">
          <SheetTitle>
            <p className="text-lg font-medium">Loading Question...</p>
            <SheetDescription className="text-muted-foreground text-sm">
              Please wait while we load the question.
            </SheetDescription>
          </SheetTitle>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          {children || (
            <Button variant="ghost" className="w-fit">
              <Edit size={16} />
            </Button>
          )}
        </SheetTrigger>
        <SheetContent
          showClose={false}
          side="right"
          className="flex min-w-screen flex-col overflow-y-auto p-0 md:min-w-[90vw] lg:min-w-[50vw]"
        >
          <FormProvider {...form}>
            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex-1 space-y-6 overflow-y-auto p-6"
              >
                <SheetHeader className="mb-6 flex flex-row items-center justify-between gap-4 p-0">
                  <SheetTitle>
                    <p className="text-lg font-medium">
                      {mode === "edit" ? "Edit Question" : "Create Question"}
                    </p>
                    <SheetDescription className="text-muted-foreground text-sm">
                      {mode === "edit"
                        ? "Edit the question and its properties."
                        : "Create a new question to use in your exams."}
                    </SheetDescription>
                  </SheetTitle>

                  {mode === "edit" && (
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => setDeleteOpen(true)}
                    >
                      <Trash2Icon className="text-destructive" size={20} />
                    </Button>
                  )}
                </SheetHeader>

                <div className="flex w-full flex-col justify-start gap-4">
                  <FormField
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Type (Required)</FormLabel>
                        <QuestionTypeSelect
                          value={field.value}
                          onChange={field.onChange}
                          includeNull={false}
                        />
                      </FormItem>
                    )}
                  />
                  {questionType && (
                    <FormField
                      control={control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Category (Optional)</FormLabel>
                          <FormControl>
                            {isLoading ? (
                              <p className="text-muted-foreground text-sm">
                                Loading categories...
                              </p>
                            ) : (
                              <QuestionCategorySelect
                                value={field.value}
                                onIdChange={field.onChange}
                                includeNull
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {questionType && (
                  <>
                    <FormField
                      control={control}
                      name="text"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question Text (Required)</FormLabel>
                          <FormControl>
                            <Textarea className="min-h-24" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name="choices"
                      render={() => (
                        <FormItem>
                          {questionType ===
                            QuestionType.MultipleChoiceSingle && (
                            <MultipleChoiceSingleEditor
                              control={control}
                              setValue={setValue}
                            />
                          )}

                          {questionType ===
                            QuestionType.MultipleChoiceMultiple && (
                            <MultipleChoiceMultipleEditor
                              control={control}
                              setValue={setValue}
                            />
                          )}

                          {questionType === QuestionType.DragAndDrop && (
                            <DragAndDropEditor
                              control={control}
                              setValue={setValue}
                            />
                          )}

                          {questionType === QuestionType.TrueFalse && (
                            <TrueFalseEditor
                              control={control}
                              setValue={setValue}
                            />
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Explanation (Optional)</FormLabel>
                          <FormControl>
                            <Textarea className="min-h-24" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <h3 className="font-medium">Question Resources</h3>
                      <div className="space-y-4 rounded-md border p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="rounded bg-gray-100 p-2">
                              <UploadIcon size={16} />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">
                                Upload Study Materials
                              </h4>
                              <p className="text-xs text-gray-500">
                                Image, PDFs, slides, documents (max 50MB)
                              </p>
                            </div>
                          </div>
                          <UploadFileDialog />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="rounded bg-gray-100 p-2">
                              <Link size={16} />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">
                                Add External Links
                              </h4>
                              <p className="text-xs text-gray-500">
                                Reference websites, videos, articles
                              </p>
                            </div>
                          </div>
                          <AddLinkDialog />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      {resources &&
                        resources?.length > 0 &&
                        resources.map((resource) => (
                          <ResourceCard key={resource} resourceId={resource} />
                        ))}
                    </div>

                    <SheetFooter className="mt-6 flex flex-row justify-between p-0">
                      <Button
                        variant="outline"
                        type="reset"
                        onClick={handleReset}
                      >
                        Reset
                      </Button>
                      <Button type="submit" disabled={isUpdating || isCreating}>
                        Save Question
                      </Button>
                    </SheetFooter>
                  </>
                )}
              </form>
            </Form>
          </FormProvider>
        </SheetContent>
      </Sheet>

      <ConfirmDeleteDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Question"
        description="Are you sure you want to delete this question? This action cannot be undone."
        onConfirm={handleDelete}
        isPending={isUpdating}
      />
    </>
  );
}
