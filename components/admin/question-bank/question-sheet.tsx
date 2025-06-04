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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2Icon, UploadIcon, ExternalLink } from "lucide-react";

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
import QuestionCategoryMultiselect from "../../categories/question-category-multiselect";
import QuestionAddLinkDialog from "./modals/question-add-link-dialog";
import QuestionUploadFileDialog from "./modals/question-upload-file-dialog";
import ResourceCard from "../resources/resource-card";
import useUpdateQuestion from "@/hooks/questions/useUpdateQuestion";
import { toast } from "sonner";
import useDeleteQuestion from "@/hooks/questions/useDeleteQuestion";
import ConfirmDeleteDialog from "@/components/common/dialogs/confirm-delete-dialog";
import useCreateQuestion from "@/hooks/questions/useCreateQuestion";
import { Resource } from "@/lib/types/resource";
import Link from "next/link";

const choiceSchema = z.object({
  text: z.string().min(1, "Choice text is required"),
  isCorrect: z.boolean(),
});

export const resourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(["File", "Url"]),
  value: z.string(),
});

export type ChoiceSchema = z.infer<typeof choiceSchema>;
export type ResourceSchema = z.infer<typeof resourceSchema>;

const schema = z
  .object({
    text: z.string().min(1, "Question text is required"),
    description: z.string().optional(),
    type: z.nativeEnum(QuestionType),
    categoryIds: z.array(z.string()).optional(),
    choices: z.array(choiceSchema).min(1, "At least one choice is required"),
    resources: z.array(resourceSchema).optional(),
  })
  .superRefine((data, ctx) => {
    const isDragAndDrop = data.type === QuestionType.DragAndDrop;
    const correctCount = data.choices.filter((c) => c.isCorrect).length;

    if (!isDragAndDrop && correctCount === 0) {
      ctx.addIssue({
        path: ["choices"],
        code: z.ZodIssueCode.custom,
        message: "At least one choice must be correct",
      });
    }
  });

export type QuestionFormSchema = z.infer<typeof schema>;

type Props = {
  mode: "create" | "edit";
  questionId?: string;
  children?: React.ReactNode;
  onSave?: (id: string) => void;
  onDelete?: (id: string) => void;
  showClose?: boolean;
};

export default function QuestionSheet({
  mode,
  questionId,
  children,
  onSave,
  onDelete,
  showClose = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const { question, isLoading } = useQuestionById(questionId || "", open);
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
  const resources = watch("resources") as Resource[] | undefined;

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(false);
      setDeleteOpen(false);
      setActiveTab("edit"); // Reset to edit tab when closing
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
      categoryIds: data.categoryIds ?? [],
      choices: updateChoices,
      resources: data.resources?.map((resource) => resource.id) ?? [],
      aiHelpEnabled: false,
    };

    const response =
      mode === "edit"
        ? await updateQuestion(updatedData)
        : await createQuestion(updatedData);

    if (response) {
      reset();
      setOpen(false);
      onSave?.(response.id);
    }
  };

  const handleDelete = async () => {
    if (!questionId) return;
    try {
      const response = await deleteQuestion();
      if (response) {
        setDeleteOpen(false);
        setOpen(false);
        onDelete?.(questionId);
      }
    } catch {
      toast.error("Failed to delete question");
    }
  };

  const handleReset = () => {
    reset({
      text: "",
      description: "",
      type: questionType || QuestionType.MultipleChoiceSingle,
      categoryIds: [],
      choices: [
        {
          text: "A choice",
          isCorrect: false,
        },
      ],
      resources: [],
    });
  };

  const triggerButton = children || (
    <Button variant="ghost" className="w-fit">
      <Edit size={16} />
    </Button>
  );

  useEffect(() => {
    if (mode === "edit" && question) {
      reset({
        text: question.text,
        description: question.description,
        type: question.type,
        choices: question.choices ?? [],
        categoryIds: question.categories.map((c) => c.id),
        resources: question.resources ?? [],
      });
    }
  }, [mode, question, reset, open]);

  if (isLoading) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>{triggerButton}</SheetTrigger>
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

  if (mode === "edit" && !question && !isLoading) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>{triggerButton}</SheetTrigger>
        <SheetContent side="right">
          <SheetTitle>
            <p className="text-lg font-medium">Question not found</p>
          </SheetTitle>
          <SheetDescription className="text-muted-foreground text-sm">
            The selected question no longer exists or failed to load.
          </SheetDescription>
        </SheetContent>
      </Sheet>
    );
  }

  if (mode === "create") {
    return (
      <>
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetTrigger asChild>{triggerButton}</SheetTrigger>

          <SheetContent
            hidden={isLoading}
            showClose={showClose}
            side="right"
            className="flex min-w-screen flex-col overflow-y-auto p-0 pt-8 md:min-w-[80vw] lg:min-w-[50vw]"
          >
            <FormProvider {...form}>
              <Form {...form}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSubmit(onSubmit)();
                  }}
                  className="flex-1 space-y-6 overflow-y-auto p-6"
                >
                  <SheetHeader className="mb-6 flex flex-row items-center justify-between gap-4 p-0">
                    <SheetTitle>
                      <p className="text-lg font-medium">Create Question</p>
                      <SheetDescription className="text-muted-foreground text-sm">
                        Create a new question to use in your exams.
                      </SheetDescription>
                    </SheetTitle>
                  </SheetHeader>

                  {/* Create mode form content */}
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
                    {questionType != undefined && (
                      <FormField
                        control={control}
                        name="categoryIds"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Category (Optional)</FormLabel>
                            <FormControl>
                              <QuestionCategoryMultiselect
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  {questionType != undefined && (
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
                            <FormLabel>Description (Optional)</FormLabel>
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
                            <QuestionUploadFileDialog />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="rounded bg-gray-100 p-2">
                                <ExternalLink size={16} />
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
                            <QuestionAddLinkDialog />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        {resources &&
                          resources?.length > 0 &&
                          resources.map((resource) => (
                            <ResourceCard
                              key={resource.id}
                              resourceId={resource.id}
                              handleDelete={() => {
                                const newResources = resources.filter(
                                  (r) => r.id !== resource.id,
                                );
                                setValue("resources", newResources);
                              }}
                            />
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
                        <Button type="submit" disabled={isCreating}>
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
      </>
    );
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>{triggerButton}</SheetTrigger>

        <SheetContent
          hidden={isLoading}
          showClose={showClose}
          side="right"
          className="flex min-w-screen flex-col overflow-y-auto p-0 pt-8 md:min-w-[80vw] lg:min-w-[50vw]"
        >
          <div className="px-6">
            <SheetHeader className="mb-6 flex flex-row items-center justify-between gap-4 p-0">
              <SheetTitle>
                <p className="text-lg font-medium">Edit Question</p>
                <SheetDescription className="text-muted-foreground text-sm">
                  Edit the question and view its usage in exams.
                </SheetDescription>
              </SheetTitle>

              <Button
                variant="ghost"
                type="button"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2Icon className="text-destructive" size={20} />
              </Button>
            </SheetHeader>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-1 flex-col"
          >
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="usage">
                  Usage ({question?.exams.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="edit"
              className="mt-0 flex-1 overflow-y-auto p-6"
            >
              <FormProvider {...form}>
                <Form {...form}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSubmit(onSubmit)();
                    }}
                    className="space-y-6"
                  >
                    <div className="flex w-full flex-col justify-start gap-4">
                      {questionType !== undefined && (
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
                      )}
                      {questionType != undefined && (
                        <FormField
                          control={control}
                          name="categoryIds"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Category (Optional)</FormLabel>
                              <FormControl>
                                <QuestionCategoryMultiselect
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    {questionType != undefined && (
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
                              <FormLabel>Description (Optional)</FormLabel>
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
                              <QuestionUploadFileDialog />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="rounded bg-gray-100 p-2">
                                  <ExternalLink size={16} />
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
                              <QuestionAddLinkDialog />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                          {resources &&
                            resources?.length > 0 &&
                            resources.map((resource) => (
                              <ResourceCard
                                key={resource.id}
                                resourceId={resource.id}
                                handleDelete={() => {
                                  const newResources = resources.filter(
                                    (r) => r.id !== resource.id,
                                  );
                                  setValue("resources", newResources);
                                }}
                              />
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
                          <Button type="submit" disabled={isUpdating}>
                            Save Question
                          </Button>
                        </SheetFooter>
                      </>
                    )}
                  </form>
                </Form>
              </FormProvider>
            </TabsContent>

            <TabsContent
              value="usage"
              className="mt-0 flex-1 overflow-y-auto p-6"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-base font-medium">
                    Exams Using This Question
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    This question is currently used in {question?.exams.length}{" "}
                    exam(s).
                  </p>
                </div>

                {question?.exams.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">
                      This question is not used in any exams yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {question?.exams.map((exam) => (
                      <div
                        key={exam.id}
                        className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <h4 className="font-medium">{exam.title}</h4>
                            <Badge
                              variant={
                                exam.status === "Published"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {exam.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm font-light">
                            Created on{" "}
                            {new Date(exam.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Link href={`/admin/exams/${exam.id}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <ExternalLink size={16} className="mr-2" />
                            View Exam
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                {question?.exams.length && question?.exams.length > 0 && (
                  <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm text-amber-800">
                      <strong>Note:</strong> Deleting this question will remove
                      it from all {question?.exams.length} exam(s) listed above.
                      Make sure to review each exam before proceeding with
                      deletion.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      <ConfirmDeleteDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Question"
        description={
          question?.exams.length && question?.exams.length > 0
            ? `Are you sure you want to delete this question? This will remove it from ${question?.exams.length} exam(s). This action cannot be undone.`
            : "Are you sure you want to delete this question? This action cannot be undone."
        }
        onConfirm={handleDelete}
        isPending={isUpdating}
      />
    </>
  );
}
