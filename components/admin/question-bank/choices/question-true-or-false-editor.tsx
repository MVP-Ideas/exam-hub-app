import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import { FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QuestionFormSchema } from "../question-sheet";
import { Label } from "@/components/ui/label";
import { QuestionChoiceCreateUpdate } from "@/lib/types/questions";

type Props = {
  control: Control<QuestionFormSchema>;
  setValue: UseFormSetValue<QuestionFormSchema>;
};

export default function TrueFalseEditor({ control, setValue }: Props) {
  const choices = useWatch({ control, name: "choices" }) ?? [];

  const correctValue = choices
    .find((choice: QuestionChoiceCreateUpdate) => choice.isCorrect)
    ?.text?.toLowerCase();

  const handleSetCorrect = (value: string) => {
    setValue("choices", [
      {
        text: "True",
        isCorrect: value === "true",
      },
      {
        text: "False",
        isCorrect: value === "false",
      },
    ]);
  };

  if (choices.length !== 2) {
    let trueIsCorrect = correctValue === "true";
    let falseIsCorrect = correctValue === "false";

    if (correctValue === undefined) {
      trueIsCorrect = false;
      falseIsCorrect = true;
    }

    setValue("choices", [
      {
        text: "True",
        isCorrect: trueIsCorrect,
      },
      {
        text: "False",
        isCorrect: falseIsCorrect,
      },
    ]);
  }

  return (
    <div className="space-y-2">
      <FormLabel>Select the correct answer</FormLabel>
      <RadioGroup
        value={correctValue || "false"}
        onValueChange={handleSetCorrect}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id="true" />
          <Label htmlFor="true">True</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="false" />
          <Label htmlFor="false">False</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
