import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import { FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { QuestionFormSchema } from "../question-sheet";
import { Label } from "@/components/ui/label";
import { QuestionType } from "@/lib/types/questions";
import { SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import useGenerateQuestionExplanation from "@/hooks/questions/useGenerateQuestionExplanation";
import { CreateQuestionChoiceRequest } from "@/lib/types/question-choice";

type Props = {
  control: Control<QuestionFormSchema>;
  setValue: UseFormSetValue<QuestionFormSchema>;
};

export default function TrueFalseEditor({ control, setValue }: Props) {
  const questionText = useWatch({ control, name: "text" });
  const choices = useWatch({ control, name: "choices" }) ?? [];
  const { generateExplanation, isPending } = useGenerateQuestionExplanation();

  const correctValue = choices
    .find((choice: CreateQuestionChoiceRequest) => choice.isCorrect)
    ?.text?.toLowerCase();

  const trueChoice = choices.find(
    (choice: CreateQuestionChoiceRequest) => choice.text === "True",
  );
  const falseChoice = choices.find(
    (choice: CreateQuestionChoiceRequest) => choice.text === "False",
  );

  const handleSetCorrect = (value: string) => {
    setValue("choices", [
      {
        text: "True",
        isCorrect: value === "true",
        explanation: trueChoice?.explanation || "",
      },
      {
        text: "False",
        isCorrect: value === "false",
        explanation: falseChoice?.explanation || "",
      },
    ]);
  };

  const handleExplanationChange = (isTrue: boolean, explanation: string) => {
    const updated = [...choices];
    const targetIndex = updated.findIndex(
      (choice) => choice.text === (isTrue ? "True" : "False"),
    );

    if (targetIndex !== -1) {
      updated[targetIndex].explanation = explanation;
      setValue("choices", updated);
    }
  };

  const handleGenerateExplanation = async () => {
    const response = await generateExplanation({
      question: questionText,
      type: QuestionType.TrueFalse,
      answers: choices.map((c) => ({
        text: c.text,
        isCorrect: c.isCorrect,
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
        explanation: "",
      },
      {
        text: "False",
        isCorrect: falseIsCorrect,
        explanation: "",
      },
    ]);
  }

  return (
    <div className="space-y-4">
      <FormLabel>Select the correct answer</FormLabel>
      <RadioGroup
        value={correctValue || "false"}
        onValueChange={handleSetCorrect}
      >
        <div className="flex flex-col gap-2">
          <div
            className={cn(
              "space-y-2 rounded-md border p-4",
              correctValue === "true" &&
                "border-green-500 bg-green-50 dark:border-green-500 dark:bg-green-950",
            )}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true" className="font-medium">
                True
              </Label>
            </div>
            <div className="ml-6">
              <Textarea
                value={trueChoice?.explanation || ""}
                placeholder="Explanation"
                className="min-h-16 text-sm"
                onChange={(e) => handleExplanationChange(true, e.target.value)}
              />
            </div>
          </div>

          <div
            className={cn(
              "space-y-2 rounded-md border p-4",
              correctValue === "false" &&
                "border-green-500 bg-green-50 dark:border-green-500 dark:bg-green-950",
            )}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false" className="font-medium">
                False
              </Label>
            </div>
            <div className="ml-6">
              <Textarea
                value={falseChoice?.explanation || ""}
                placeholder="Explanation"
                className="min-h-16 text-sm"
                onChange={(e) => handleExplanationChange(false, e.target.value)}
              />
            </div>
          </div>
        </div>
      </RadioGroup>

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
