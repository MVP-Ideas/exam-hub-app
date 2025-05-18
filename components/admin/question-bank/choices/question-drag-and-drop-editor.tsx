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
import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon, GripVertical } from "lucide-react";
import { QuestionChoiceCreateUpdate } from "@/lib/types/questions";
import { QuestionFormSchema } from "../question-sheet";

type Props = {
  control: Control<QuestionFormSchema>;
  setValue: UseFormSetValue<QuestionFormSchema>;
};

export default function DragAndDropEditor({ control, setValue }: Props) {
  const choices = useWatch({ control, name: "choices" }) ?? [];
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
    const newChoice: QuestionChoiceCreateUpdate = {
      text: "New choice",
      isCorrect: false,
    };
    setValue("choices", [...choices, newChoice]);
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
          <div className="space-y-2 rounded-md border p-2">
            {choices.map((choice, index) => (
              <SortableItem
                key={sortableIds[index]}
                id={sortableIds[index]}
                text={choice.text}
                index={index}
                onTextChange={(text) => {
                  const updated = [...choices];
                  updated[index].text = text;
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
            <div className="bg-background flex items-center justify-between gap-2 rounded border p-2 shadow-lg">
              <div className="text-muted-foreground cursor-grab pr-1 select-none">
                <GripVertical size={16} />
              </div>
              <Input
                value={choices[activeIndex]?.text || ""}
                readOnly
                className="w-full"
              />
              <Button variant="ghost" size="icon" tabIndex={-1}>
                <XIcon size={16} />
              </Button>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <Button
        variant="outline"
        className="mt-2 w-full"
        type="button"
        onClick={handleAddChoice}
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
  index: number;
  onTextChange: (text: string) => void;
  onRemove: () => void;
  isDragging: boolean;
};

function SortableItem({
  id,
  text,
  index,
  onTextChange,
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
      className={`bg-background flex items-center justify-between gap-2 rounded border p-2 ${isDragging ? "z-10" : ""}`}
      data-index={index}
    >
      <div
        {...attributes}
        {...listeners}
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
