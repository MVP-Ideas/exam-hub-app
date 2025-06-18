import { ExamSessionQuestionResult } from "@/lib/types/exam-session";
import { QuestionType } from "@/lib/types/questions";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
export function QuestionReview({
  question,
  index,
  points,
  setPoints,
}: {
  question: ExamSessionQuestionResult;
  index: number;
  points: number;
  setPoints: (points: number) => void;
}) {

  const getQuestionTypeText = (
    questionPoints: number,
    answerPoints: number,
    text: string,
  ) => {
    const isCorrect = questionPoints === answerPoints;
    const isPartialCorrect = answerPoints > 0 && !isCorrect;
    return (
      <p
        className={cn(
          `text-start text-sm font-bold md:text-lg`,
          isCorrect
            ? "text-green-500 dark:text-green-300"
            : isPartialCorrect
              ? "text-yellow-500 dark:text-yellow-300"
              : "text-red-500 dark:text-red-300",
        )}
      >
        {text}
      </p>
    );
  };

  const correctType = (questionPoints: number, answerPoints: number) => {
    if (questionPoints === answerPoints) {
      return "Correct";
    } else if (answerPoints > 0) {
      return "PartiallyCorrect";
    } else {
      return "Incorrect";
    }
  };

  return (
    <div className="w-full flex-col gap-y-4 border-t">
      <div className="flex w-full flex-col items-start justify-between gap-y-2 px-8 py-2 md:flex-row md:items-center">
        <div className="flex h-full flex-col items-center pr-4">
          {correctType(question.points, question.answer?.points || 0) ===
          "Correct" ? (
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
          ) : correctType(question.points, question.answer?.points || 0) ===
            "PartiallyCorrect" ? (
            <CheckCircleIcon className="h-6 w-6 text-yellow-500" />
          ) : (
            <XCircleIcon className="h-6 w-6 text-red-500" />
          )}
        </div>
        <div className="flex w-full flex-col items-start">
          <div className="flex flex-row items-center">
            <p className="text-sm font-bold md:text-base">
              Question {index + 1}
            </p>
          </div>
          <p className="text-muted-foreground text-start text-xs md:text-sm">
            {question.text}
          </p>
        </div>

        <div className="flex flex-col items-start space-y-1 md:items-end">
          <Label htmlFor={`points-${question.id}`} className="text-xs">
            Points
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id={`points-${question.id}`}
              type="number"
              min="0"
              max={question.points}
              value={points}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value) && value >= 0 && value <= question.points) {
                  setPoints(value);
                }
              }}
              className="h-8 w-24 text-center"
            />
          </div>
          <p className="text-muted-foreground text-xs">
            (out of {question.points || 0})
          </p>
        </div>
      </div>

      {/* Content section - always visible */}
      <div className="bg-accent flex w-full flex-col items-start px-8 py-4">
        <div className="flex w-full flex-col items-start gap-y-4 pl-1">
          <div className="flex flex-col items-start">
            <p className="text-muted-foreground text-xs md:text-sm">Answer</p>
            {(() => {
              if (
                question.type === QuestionType.MultipleChoiceSingle ||
                question.type === QuestionType.TrueFalse
              ) {
                return (
                  <div>
                    {question.answer?.choices.map((choice) => (
                      <div key={choice.questionChoiceId}>
                        {getQuestionTypeText(
                          question.points,
                          question.answer?.points || 0,
                          choice.text || "",
                        )}
                      </div>
                    ))}
                  </div>
                );
              } else if (
                question.type === QuestionType.MultipleChoiceMultiple
              ) {
                return (
                  <ul className="list-disc pl-4">
                    {question.answer?.choices.map((choice) => (
                      <li key={choice.questionChoiceId}>
                        {getQuestionTypeText(
                          question.points,
                          question.answer?.points || 0,
                          choice.text || "",
                        )}
                      </li>
                    ))}
                  </ul>
                );
              } else if (question.type === QuestionType.DragAndDrop) {
                return (
                  <ol className="list-decimal pl-4">
                    {question.answer?.choices
                      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                      .map((choice) => (
                        <li key={choice.questionChoiceId}>
                          {getQuestionTypeText(
                            question.points,
                            question.answer?.points || 0,
                            choice.text || "",
                          )}
                        </li>
                      ))}
                  </ol>
                );
              }
              return null;
            })()}
          </div>

          <div className="flex flex-col items-start">
            <p className="text-muted-foreground text-xs md:text-sm">
              Correct Answer
            </p>
            {(() => {
              if (
                question.type === QuestionType.MultipleChoiceSingle ||
                question.type === QuestionType.TrueFalse
              ) {
                return (
                  <div>
                    {question?.correctChoices.map((choice) => (
                      <div key={choice.id}>
                        {getQuestionTypeText(
                          question.points,
                          question.points,
                          choice.text || "",
                        )}
                      </div>
                    ))}
                  </div>
                );
              } else if (
                question.type === QuestionType.MultipleChoiceMultiple
              ) {
                return (
                  <ul className="list-disc pl-4">
                    {question?.correctChoices.map((choice) => (
                      <li key={choice.id}>
                        {getQuestionTypeText(
                          question.points,
                          question.points,
                          choice.text || "",
                        )}
                      </li>
                    ))}
                  </ul>
                );
              } else if (question.type === QuestionType.DragAndDrop) {
                return (
                  <ol className="list-decimal pl-4">
                    {question?.correctChoices
                      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                      .map((choice) => (
                        <li key={choice.id}>
                          {getQuestionTypeText(
                            question.points,
                            question.points,
                            choice.text || "",
                          )}
                        </li>
                      ))}
                  </ol>
                );
              }
              return null;
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
