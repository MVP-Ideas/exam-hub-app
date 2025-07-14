"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useWatch, Control, UseFormSetValue } from "react-hook-form";
import { useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon, GripVertical, SparklesIcon } from "lucide-react";
import { QuestionType } from "@/lib/types/questions";
import { QuestionFormSchema } from "../question-sheet";
import useGenerateQuestionExplanation from "@/hooks/questions/useGenerateQuestionExplanation";
import { CreateQuestionChoiceRequest } from "@/lib/types/question-choice";

type Props = {
  control: Control<QuestionFormSchema>;
  setValue: UseFormSetValue<QuestionFormSchema>;
};

export default function DragAndDropEditor({ control, setValue }: Props) {
  const questionText = useWatch({ control, name: "text" });
  const choices = useWatch({ control, name: "choices" }) ?? [];
  const { generateExplanation, isPending } = useGenerateQuestionExplanation();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const idMapRef = useRef<Map<number, string>>(new Map());

  const sortableIds = useMemo(() => {
    return choices.map((_, index) => {
      if (!idMapRef.current.has(index)) {
        idMapRef.current.set(index, `choice-${crypto.randomUUID()}`);
      }
      return idMapRef.current.get(index)!;
    });
  }, [choices.length]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveIndex(sortableIds.findIndex((id) => id === active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setActiveIndex(null);

    if (!over || active.id === over.id) return;

    const oldIndex = sortableIds.findIndex((id) => id === active.id);
    const newIndex = sortableIds.findIndex((id) => id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newChoices = arrayMove([...choices], oldIndex, newIndex);
    setValue("choices", newChoices);
  };

  const handleAddChoice = () => {
    const newChoice: CreateQuestionChoiceRequest = {
      text: "",
      isCorrect: false,
      explanation: "",
    };
    setValue("choices", [...choices, newChoice]);
  };

  const handleGenerateExplanation = async () => {
    const response = await generateExplanation({
      question: questionText,
      type: QuestionType.DragAndDrop,
      answers: choices.map((c, index) => ({
        text: c.text,
        order: index,
      })),
    });

    if (response) {
      const updated = choices.map((c) => ({
        ...c,
        explanation: response.answers.find((a) => a.text === c.text)
          ?.explanation,
      }));
      setValue("choices", updated);
    }
  };

  return (
    <div className="space-y-2">
      <FormLabel>Draggable Items (Required)</FormLabel>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortableIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {choices.map((choice, index) => (
              <SortableItem
                key={sortableIds[index]}
                id={sortableIds[index]}
                text={choice.text}
                explanation={choice.explanation || ""}
                index={index}
                onTextChange={(text) => {
                  const updated = [...choices];
                  updated[index].text = text;
                  setValue("choices", updated);
                }}
                onExplanationChange={(explanation) => {
                  const updated = [...choices];
                  updated[index].explanation = explanation;
                  setValue("choices", updated);
                }}
                onRemove={() => {
                  const updatedChoices = choices.filter((_, i) => i !== index);
                  setValue("choices", updatedChoices);
                }}
                isDragging={sortableIds[index] === activeId}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay adjustScale={false}>
          {activeId && activeIndex !== null && (
            <div className="bg-background flex flex-col gap-2 rounded-md border p-4 shadow-lg">
              <div className="flex items-center justify-between gap-2">
                <div className="text-muted-foreground cursor-grab pr-1 select-none">
                  <GripVertical size={16} />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <Input
                    value={choices[activeIndex]?.text || ""}
                    readOnly
                    className="w-full"
                  />
                  <Textarea
                    value={choices[activeIndex]?.explanation || ""}
                    readOnly
                    className="min-h-16 text-sm"
                  />
                </div>
                <Button variant="ghost" size="icon" tabIndex={-1}>
                  <XIcon size={16} />
                </Button>
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Add Item Button */}
      <Button
        variant="outline"
        className="mt-2 w-full"
        type="button"
        onClick={handleAddChoice}
      >
        <PlusIcon size={16} className="mr-2" />
        Add Item
      </Button>

      {/* Generate Question Explanation */}
      <Button
        variant="default"
        className="w-full"
        type="button"
        onClick={handleGenerateExplanation}
        disabled={isPending}
      >
        <SparklesIcon size={16} className="mr-2" />
        Generate Explanation
      </Button>
    </div>
  );
}

type ItemProps = {
  id: string;
  text: string;
  explanation: string;
  index: number;
  onTextChange: (text: string) => void;
  onExplanationChange: (explanation: string) => void;
  onRemove: () => void;
  isDragging: boolean;
};

function SortableItem({
  id,
  text,
  explanation,
  index,
  onTextChange,
  onExplanationChange,
  onRemove,
  isDragging,
}: ItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-background flex flex-col gap-2 rounded-md border p-4 ${isDragging ? "z-10" : ""}`}
      data-index={index}
    >
      <div className="flex items-center justify-between gap-2">
        <div
          {...attributes}
          {...listeners}
          className="text-muted-foreground cursor-grab pr-1 select-none"
        >
          <GripVertical size={16} />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Input
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            className="w-full"
            placeholder="Enter draggable item..."
          />
          <Textarea
            value={explanation}
            onChange={(e) => onExplanationChange(e.target.value)}
            placeholder="Explanation"
            className="min-h-16 text-sm"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="hover:bg-red-500 hover:text-white"
        >
          <XIcon size={16} />
        </Button>
      </div>
    </div>
  );
}
