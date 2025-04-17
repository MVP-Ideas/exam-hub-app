import { Control, UseFormSetValue } from "react-hook-form";
import { FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QuestionFormSchema } from "../question-sheet";

type Props = {
  control: Control<QuestionFormSchema>;
  setValue: UseFormSetValue<QuestionFormSchema>;
};

export default function TrueFalseEditor({ setValue }: Props) {
  return (
    <div className="space-y-2">
      <FormLabel>Select the correct answer</FormLabel>
      <RadioGroup
        onValueChange={(val) =>
          setValue("choices", [
            {
              id: "true",
              questionId: "",
              text: "True",
              isCorrect: val === "true",
            },
            {
              id: "false",
              questionId: "",
              text: "False",
              isCorrect: val === "false",
            },
          ])
        }
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id="true" />
          <label htmlFor="true">True</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="false" />
          <label htmlFor="false">False</label>
        </div>
      </RadioGroup>
    </div>
  );
}
