import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QuestionChoiceCreateUpdate } from "@/lib/types/questions";

import { XIcon, PlusIcon } from "lucide-react";
import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import { ChoiceSchema, QuestionFormSchema } from "../question-sheet";

export default function MultipleChoiceSingleEditor({
  control,
  setValue,
}: {
  control: Control<QuestionFormSchema>;
  setValue: UseFormSetValue<QuestionFormSchema>;
}) {
  const choices = useWatch({ control, name: "choices" }) ?? [];

  // Determine which choice is currently correct
  const correctIndex = choices.findIndex((c: ChoiceSchema) => c.isCorrect);

  const handleSetCorrect = (index: number) => {
    const updated: ChoiceSchema[] = choices.map(
      (c: QuestionChoiceCreateUpdate, i: number) => ({
        ...c,
        isCorrect: i === index,
      }),
    );
    setValue("choices", updated);
  };

  return (
    <div className="w-full space-y-2">
      <FormLabel>Answer Options (Required)</FormLabel>
      <RadioGroup
        value={correctIndex.toString()}
        onValueChange={(val) => handleSetCorrect(Number(val))}
      >
        <div className="rounded-md border">
          {choices.map((choice: QuestionChoiceCreateUpdate, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2 border-b p-2 last:border-0"
            >
              <div className="flex w-full items-center gap-2">
                <RadioGroupItem
                  value={index.toString()}
                  id={`radio-${index}`}
                  className="mt-1"
                />
                <Input
                  id={`radio-${index}`}
                  value={choice.text}
                  className="w-full"
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
      </RadioGroup>

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
