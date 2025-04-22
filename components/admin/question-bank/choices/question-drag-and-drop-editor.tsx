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
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useWatch, Control, UseFormSetValue } from "react-hook-form";
import { useEffect, useMemo, useRef } from "react";
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

  // Generate temporary unique IDs for sortable mapping
  const idMapRef = useRef<Map<number, string>>(new Map());

  const sortableIds = useMemo(() => {
    return choices.map((_, index) => {
      if (!idMapRef.current.has(index)) {
        idMapRef.current.set(index, `choice-${crypto.randomUUID()}`);
      }
      return idMapRef.current.get(index)!;
    });
  }, [choices.length]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortableIds.findIndex((id) => id === active.id);
    const newIndex = sortableIds.findIndex((id) => id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newChoices = [...choices];
    const [moved] = newChoices.splice(oldIndex, 1);
    newChoices.splice(newIndex, 0, moved);

    const newSortableIds = [...sortableIds];
    const [movedId] = newSortableIds.splice(oldIndex, 1);
    newSortableIds.splice(newIndex, 0, movedId);

    setValue("choices", newChoices);
  };

  const handleAddChoice = () => {
    const newChoice: QuestionChoiceCreateUpdate = {
      text: "New choice",
      isCorrect: false,
    };
    setValue("choices", [...choices, newChoice]);
  };

  useEffect(() => {
    const newMap = new Map<number, string>();
    choices.forEach((_, idx) => {
      newMap.set(idx, `choice-${crypto.randomUUID()}`);
    });
    idMapRef.current = newMap;
  }, [choices.length]);

  return (
    <div className="space-y-2">
      <FormLabel>Draggable Items (Required)</FormLabel>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortableIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1 rounded-md border p-1">
            {choices.map((choice, index) => (
              <SortableItem
                key={sortableIds[index]}
                id={sortableIds[index]}
                text={choice.text}
                onTextChange={(text) => {
                  const updated = [...choices];
                  updated[index].text = text;
                  setValue("choices", updated);
                }}
                onRemove={() => {
                  const updatedChoices = choices.filter((_, i) => i !== index);

                  setValue("choices", updatedChoices);
                }}
              />
            ))}
          </div>
        </SortableContext>
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
  onTextChange: (text: string) => void;
  onRemove: () => void;
};

function SortableItem({ id, text, onTextChange, onRemove }: ItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-background flex items-center justify-between gap-2 rounded border p-2 transition-shadow"
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
