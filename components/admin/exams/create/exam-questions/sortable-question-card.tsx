import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useQuestionById from "@/hooks/questions/useQuestionById";
import { getQuestionTypeBadge } from "@/lib/constants/question";
import { cn } from "@/lib/utils";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical, Eye, TagIcon, XIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import QuestionSheet from "../../../question-bank/question-sheet";
import { ExamFormSchema } from "../exam-form";

type Props = {
  id: string;
  index: number;
  handleDelete: (id: string) => void;
  disabled?: boolean;
};

export default function SortableQuestionCard({
  id,
  index,
  handleDelete,
  disabled = false,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const { control } = useFormContext<ExamFormSchema>();
  const { question, isLoading, isError } = useQuestionById(id);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "transform 150ms ease" : transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 50 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "mb-2 rounded-lg border bg-white p-5 shadow-sm transition-colors duration-200 md:p-0",
        "hover:bg-accent",
        "flex flex-col items-center gap-4 md:grid md:grid-cols-[2fr_1.5fr_1.5fr_0.5fr_0.5fr] md:justify-center md:p-3",
      )}
    >
      {/* Drag handle */}
      <div
        className={
          "flex w-full max-w-full flex-col items-center gap-2 overflow-hidden md:flex-row"
        }
        {...attributes}
        {...listeners}
      >
        <div className="flex items-start justify-center md:items-center">
          <GripVertical
            size={16}
            className="text-muted-foreground cursor-grab"
          />
        </div>

        {/* Question text and description */}
        <div className="flex flex-col overflow-hidden">
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : isError ? (
            <p className="text-destructive text-sm">Error loading question</p>
          ) : (
            <>
              <p className="text-primary truncate overflow-hidden text-sm font-bold whitespace-nowrap">
                {question?.text}
              </p>
              <p className="text-muted-foreground truncate overflow-hidden text-xs whitespace-nowrap">
                {question?.description}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Type */}
      <div
        className="text-muted-foreground text-xs"
        {...attributes}
        {...listeners}
      >
        {(question && getQuestionTypeBadge(question.type)) || "-"}
      </div>

      {/* Category */}
      <div {...attributes} {...listeners}>
        <div className="flex flex-row items-center gap-2">
          <TagIcon size={12} className="shrink-0" />
          <p className="text-muted-foreground text-xs">
            {question?.category || "No category"}
          </p>
        </div>
      </div>

      {/* Points */}
      <FormField
        control={control}
        name={`questions.${index}.points`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                disabled={disabled}
                type="text"
                min={1}
                className="text-center"
                value={field.value}
                onChange={(e) => {
                  // Check if number

                  if (isNaN(Number(e.target.value))) {
                    return;
                  }

                  field.onChange(
                    e.target.value === "" ? "" : Number(e.target.value),
                  );
                }}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      {/* Actions */}
      <div className="mt-2 flex items-center justify-end gap-1 md:mt-0">
        <QuestionSheet onDelete={handleDelete} mode="edit" questionId={id}>
          <Button
            className="p-0"
            variant="ghost"
            type="button"
            disabled={disabled}
          >
            <Eye className="text-muted-foreground" size={16} />
          </Button>
        </QuestionSheet>
        <Button
          disabled={disabled}
          className="p-0"
          variant="ghost"
          type="button"
          onClick={() => handleDelete(id)}
        >
          <XIcon className="text-destructive" size={16} />
        </Button>
      </div>
    </div>
  );
}
