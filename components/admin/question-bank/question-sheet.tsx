"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Edit, Link, Trash2Icon, UploadIcon } from "lucide-react";

import useQuestionById from "@/hooks/questions/useQuestionById";
import { QuestionType } from "@/lib/types/questions";
import DragAndDropEditor from "./choices/question-drag-and-drop-editor";
import TrueFalseEditor from "./choices/question-true-or-false-editor";
import MultipleChoiceSingleEditor from "./choices/question-multiple-choice-single-editor";
import MultipleChoiceMultipleEditor from "./choices/question-multiple-choice-multiple";

const choiceSchema = z.object({
  id: z.string().optional(),
  questionId: z.string(),
  text: z.string().min(1, "Choice text is required"),
  isCorrect: z.boolean(),
  order: z.number().nullable().optional(),
});

export type ChoiceSchema = z.infer<typeof choiceSchema>;

const schema = z.object({
  text: z.string().min(1, "Question text is required"),
  description: z.string().optional(),
  type: z.nativeEnum(QuestionType),
  choices: z.array(choiceSchema).min(1, "At least one choice is required"),
});

export type QuestionFormSchema = z.infer<typeof schema>;

type Props = {
  questionId: string;
};

export default function QuestionSheet({ questionId }: Props) {
  const { question, isLoading } = useQuestionById(questionId);

  const form = useForm<QuestionFormSchema>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (question) {
      reset({
        text: question.text,
        description: question.description,
        type: question.type,
        choices: question.choices ?? [],
      });
    }
  }, [question, reset]);

  const questionType = watch("type");

  const onSubmit = (data: QuestionFormSchema) => {
    console.log("Validated:", data);
  };

  if (isLoading || !question) {
    return (
      <Sheet open>
        <SheetContent side="right">
          <div className="text-muted-foreground p-6 text-sm">
            Loading question...
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="w-fit">
          <Edit />
        </Button>
      </SheetTrigger>
      <SheetContent
        showClose={false}
        side="right"
        className="flex min-w-screen flex-col overflow-y-auto p-0 md:min-w-[90vw] lg:min-w-[35vw]"
      >
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 space-y-6 overflow-y-auto p-6"
          >
            <SheetHeader className="mb-6 flex flex-row items-center justify-between gap-4 p-0">
              <SheetTitle>
                <p className="text-lg font-medium">Edit Question</p>
                <SheetDescription className="text-muted-foreground text-sm">
                  Edit the question and its properties.
                </SheetDescription>
              </SheetTitle>
              <Button variant="ghost" type="button">
                <Trash2Icon
                  className="text-destructive"
                  onClick={() => console.log("Delete question")}
                  size={20}
                />
              </Button>
            </SheetHeader>

            <FormField
              control={control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-24" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(QuestionType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {questionType === QuestionType.MultipleChoiceSingle && (
              <MultipleChoiceSingleEditor
                control={control}
                setValue={setValue}
              />
            )}

            {questionType === QuestionType.MultipleChoiceMultiple && (
              <MultipleChoiceMultipleEditor
                control={control}
                setValue={setValue}
              />
            )}

            {questionType === QuestionType.DragAndDrop && (
              <DragAndDropEditor control={control} setValue={setValue} />
            )}

            {questionType === QuestionType.TrueFalse && (
              <TrueFalseEditor control={control} setValue={setValue} />
            )}

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
                  <Button variant="outline" size="sm" type="button">
                    Upload
                  </Button>
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
                  <Button variant="outline" size="sm" type="button">
                    Add link
                  </Button>
                </div>
              </div>
            </div>

            <SheetFooter className="mt-6 flex flex-row justify-between p-0">
              <Button variant="outline" type="reset">
                Reset
              </Button>
              <SheetClose asChild>
                <Button type="submit">Save Question</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
