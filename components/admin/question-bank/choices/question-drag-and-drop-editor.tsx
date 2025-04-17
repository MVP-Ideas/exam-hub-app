"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { useWatch, Control, UseFormSetValue } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon, GripVertical } from "lucide-react";
import { QuestionChoice } from "@/lib/types/questions";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { QuestionFormSchema } from "../question-sheet";

type Props = {
  control: Control<QuestionFormSchema>;
  setValue: UseFormSetValue<QuestionFormSchema>;
};

export default function DragAndDropEditor({ control, setValue }: Props) {
  const choices = useWatch({ control, name: "choices" }) ?? [];

  const [, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = choices.findIndex((item) => item.id === active.id);
    const newIndex = choices.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const updated = [...choices];
    const [moved] = updated.splice(oldIndex, 1);
    updated.splice(newIndex, 0, moved);

    setValue("choices", updated);
  };

  return (
    <div className="space-y-2">
      <FormLabel>Draggable Items</FormLabel>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={(e) => setActiveId(e.active.id as string)}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="space-y-1 rounded-md border p-1">
          {choices.map((choice, index) => (
            <DraggableItem
              key={choice.id}
              id={choice.id ?? `choice-${index}`}
              text={choice.text}
              onTextChange={(text) => {
                const updated = [...choices];
                updated[index].text = text;
                setValue("choices", updated);
              }}
              onRemove={() => {
                const updated = choices.filter((_, i) => i !== index);
                setValue("choices", updated);
              }}
            />
          ))}
        </div>
      </DndContext>

      <Button
        variant="outline"
        className="mt-2 w-full"
        type="button"
        onClick={() => {
          const newChoice: QuestionChoice = {
            id: crypto.randomUUID(),
            questionId: choices[0]?.questionId || "",
            text: "New choice",
            isCorrect: false,
          };
          setValue("choices", [...choices, newChoice]);
        }}
      >
        <PlusIcon size={16} className="mr-2" />
        Add Item
      </Button>
    </div>
  );
}

type ItemProps = {
  id: string;
  text: string;
  onTextChange: (text: string) => void;
  onRemove: () => void;
};

function DraggableItem({ id, text, onTextChange, onRemove }: ItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
  } = useDraggable({ id });
  const { setNodeRef: setDropRef } = useDroppable({ id });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div
      ref={(node) => {
        setDragRef(node);
        setDropRef(node);
      }}
      style={style}
      className="bg-background flex items-center justify-between gap-2 rounded border p-2 transition-shadow"
    >
      <div
        {...listeners}
        {...attributes}
        className="text-muted-foreground cursor-grab pr-1 select-none"
      >
        <GripVertical size={16} />
      </div>
      <Input
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        className="w-full"
      />
      <Button variant="ghost" size="icon" onClick={onRemove}>
        <XIcon size={16} />
      </Button>
    </div>
  );
}
