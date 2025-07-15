import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { QuestionType } from "@/lib/types/questions";
import { Checkbox } from "@/components/ui/checkbox";
import { XIcon, PlusIcon, SparklesIcon } from "lucide-react";
import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import { QuestionFormSchema } from "../question-sheet";
import { cn } from "@/lib/utils";
import useGenerateQuestionExplanation from "@/hooks/questions/useGenerateQuestionExplanation";
import { CreateQuestionChoiceRequest } from "@/lib/types/question-choice";

export default function MultipleChoiceMultipleEditor({
  control,
  setValue,
}: {
  control: Control<QuestionFormSchema>;
  setValue: UseFormSetValue<QuestionFormSchema>;
}) {
  const questionText = useWatch({ control, name: "text" });
  const choices = useWatch({ control, name: "choices" }) ?? [];
  const { generateExplanation, isPending } = useGenerateQuestionExplanation();

  const toggleCorrect = (index: number) => {
    const updated = [...choices];
    updated[index].isCorrect = !updated[index].isCorrect;
    setValue("choices", updated);
  };

  const handleGenerateExplanation = async () => {
    const response = await generateExplanation({
      question: questionText,
      type: QuestionType.MultipleChoiceMultiple,
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

  return (
    <div className="space-y-2">
      <FormLabel>Selectable Options (Required)</FormLabel>
      <div className="flex flex-col gap-2">
        {choices.map((choice: CreateQuestionChoiceRequest, index: number) => (
          <div
            key={index}
            className={cn(
              "flex flex-col gap-2 rounded-md border p-4",
              choice.isCorrect &&
                "border-green-500 bg-green-50 dark:border-white dark:bg-green-950",
            )}
          >
            <div className="flex flex-row items-center justify-between gap-2">
              <div className="flex w-full items-center gap-2">
                <Checkbox
                  id={`checkbox-${index}`}
                  checked={choice.isCorrect}
                  onCheckedChange={() => toggleCorrect(index)}
                />
                <div className="flex w-full flex-col gap-2">
                  <Textarea
                    className="min-h-10 w-full text-sm"
                    value={choice.text}
                    placeholder="Enter answer option..."
                    onChange={(e) => {
                      const updated = [...choices];
                      updated[index].text = e.target.value;
                      setValue("choices", updated);
                    }}
                  />
                  <Textarea
                    value={choice.explanation || ""}
                    placeholder="Explanation"
                    className="min-h-16 text-sm"
                    onChange={(e) => {
                      const updated = [...choices];
                      updated[index].explanation = e.target.value;
                      setValue("choices", updated);
                    }}
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-red-500 hover:text-white"
                onClick={() => {
                  const updated = choices.filter((_, i) => i !== index);
                  setValue("choices", updated);
                }}
              >
                <XIcon size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Option Button */}
      <Button
        variant="outline"
        className="mt-2 w-full"
        type="button"
        onClick={() => {
          const newChoice: CreateQuestionChoiceRequest = {
            text: "",
            isCorrect: false,
            explanation: "",
          };
          setValue("choices", [...choices, newChoice]);
        }}
      >
        <PlusIcon size={16} className="mr-2" />
        Add Option
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
