import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QuestionChoiceCreateUpdate } from "@/lib/types/questions";
import { Checkbox } from "@/components/ui/checkbox";
import { XIcon, PlusIcon } from "lucide-react";
import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import { QuestionFormSchema } from "../question-sheet";

export default function MultipleChoiceMultipleEditor({
  control,
  setValue,
}: {
  control: Control<QuestionFormSchema>;
  setValue: UseFormSetValue<QuestionFormSchema>;
}) {
  const choices = useWatch({ control, name: "choices" }) ?? [];

  const toggleCorrect = (index: number) => {
    const updated = [...choices];
    updated[index].isCorrect = !updated[index].isCorrect;
    setValue("choices", updated);
  };

  return (
    <div className="space-y-2">
      <FormLabel>Selectable Options (Required)</FormLabel>
      <div className="rounded-md border">
        {choices.map((choice: QuestionChoiceCreateUpdate, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between gap-2 border-b p-2 last:border-0"
          >
            <div className="flex w-full items-center gap-2">
              <Checkbox
                id={`checkbox-${index}`}
                checked={choice.isCorrect}
                onCheckedChange={() => toggleCorrect(index)}
              />
              <Input
                className="w-full"
                value={choice.text}
                onChange={(e) => {
                  const updated = [...choices];
                  updated[index].text = e.target.value;
                  setValue("choices", updated);
                }}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const updated = choices.filter((_, i) => i !== index);
                setValue("choices", updated);
              }}
            >
              <XIcon size={16} />
            </Button>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        className="mt-2 w-full"
        type="button"
        onClick={() => {
          const newChoice: QuestionChoiceCreateUpdate = {
            text: "",
            isCorrect: false,
          };
          setValue("choices", [...choices, newChoice]);
        }}
      >
        <PlusIcon size={16} className="mr-2" />
        Add Option
      </Button>
    </div>
  );
}
