"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Button } from "@/components/ui/button";
import { ClipboardPlus, PlusCircleIcon, Search } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ExamFormSchema } from "../ExamForm";
import QuestionSheet from "../../../question-bank/QuestionSheet";
import SortableQuestionCard from "./SortableQuestionCard";
import QuestionPickerSheet from "./QuestionPickerSheet";
import { useState } from "react";

type Props = {
  disabled?: boolean;
};

export default function ExamQuestions({ disabled = false }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const { watch, setValue, control } = useFormContext<ExamFormSchema>();
  const { fields } = useFieldArray({
    control,
    name: "questions",
  });
  const questions = watch("questions") || [];
  const totalPoints = questions.reduce(
    (acc, question) => acc + (question.points || 0),
    0,
  );

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = questions.findIndex((q) => q.questionId === active.id);
    const newIndex = questions.findIndex((q) => q.questionId === over.id);

    const reordered = arrayMove(questions, oldIndex, newIndex);
    setValue("questions", reordered, { shouldDirty: true });
  };

  const handleCreateQuestion = (id: string) => {
    const existingQuestion = questions.find((q) => q.questionId === id);
    if (existingQuestion) {
      return;
    }

    setValue("questions", [...questions, { questionId: id, points: 1 }]);
  };

  const handleDeleteQuestion = (id: string) => {
    const updatedQuestions = questions.filter((q) => q.questionId !== id);
    setValue("questions", updatedQuestions, { shouldDirty: true });
  };

  return (
    <div
      id="exam-questions"
      className="bg-background border-muted-foreground/20 flex w-full flex-col gap-2 rounded-lg border p-5 md:gap-4"
    >
      <h2 className="w-full text-lg font-bold">Question</h2>
      <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row md:gap-6">
        <QuestionSheet mode="create" onSave={handleCreateQuestion}>
          <Button
            variant="outline"
            type="button"
            className="w-full flex-1"
            disabled={disabled}
          >
            <PlusCircleIcon size={16} />
            Add a New Question
          </Button>
        </QuestionSheet>
        <Button
          variant="outline"
          type="button"
          onClick={() => setPickerOpen(true)}
          className="w-full flex-1"
          disabled={disabled}
        >
          <Search size={16} />
          Use an Existing Question
        </Button>

        <QuestionPickerSheet
          open={pickerOpen}
          setOpen={setPickerOpen}
          onSelect={(id) => handleCreateQuestion(id)}
          addedQuestionIds={questions.map((q) => q.questionId)}
        />
      </div>

      <div className="bg-muted flex min-h-[400px] w-full flex-col justify-between overflow-x-hidden overflow-y-auto rounded-lg p-0">
        {questions.length === 0 ? (
          <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-4">
            <ClipboardPlus size={60} className="text-muted-foreground" />
            <p className="text-muted-foreground font-bold">
              No questions added yet.
            </p>
          </div>
        ) : (
          <>
            <div className="flex w-full flex-col gap-0">
              <div className="h-full w-full p-2">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    disabled={disabled}
                    items={questions.map((q) => q.questionId)}
                    strategy={verticalListSortingStrategy}
                  >
                    {fields.map((field, index) => {
                      const questionId = watch(`questions.${index}.questionId`);
                      return (
                        <SortableQuestionCard
                          disabled={disabled}
                          key={field.questionId}
                          id={questionId}
                          index={index}
                          handleDelete={handleDeleteQuestion}
                        />
                      );
                    })}
                  </SortableContext>
                </DndContext>
              </div>
            </div>

            <div className="border-primary bg-primary/5 flex w-full flex-row items-center justify-center gap-6 rounded-b-lg border px-10 py-2">
              <div className="flex flex-row items-center gap-2 text-sm font-bold">
                <p>Total Items:</p>
                <span className="bg-primary text-background flex h-6 w-6 items-center justify-center rounded-full text-center text-sm">
                  {questions.length}
                </span>
              </div>
              <div className="flex flex-row items-center gap-2 text-sm font-bold">
                <p>Total Points:</p>
                <span className="text-background flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-center text-sm">
                  {totalPoints}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
