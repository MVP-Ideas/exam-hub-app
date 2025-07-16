import { ExamSessionQuestionResultResponse } from "@/lib/types/exam-session-question";
import { QuestionType } from "@/lib/types/questions";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { AnswerChoice } from "@/lib/types/answer-choice";

export function QuestionReview({
  question: examSessionQuestion,
  index,
  points,
  setPoints,
}: {
  question: ExamSessionQuestionResultResponse;
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
          {correctType(
            examSessionQuestion.points,
            examSessionQuestion.points || 0,
          ) === "Correct" ? (
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
          ) : correctType(
              examSessionQuestion.points,
              examSessionQuestion.points || 0,
            ) === "PartiallyCorrect" ? (
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
            {examSessionQuestion.question.text}
          </p>
        </div>

        <div className="flex flex-col items-start space-y-1 md:items-end">
          <Label
            htmlFor={`points-${examSessionQuestion.id}`}
            className="text-xs"
          >
            Points
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id={`points-${examSessionQuestion.id}`}
              type="number"
              min="0"
              max={examSessionQuestion.points}
              value={points}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (
                  !isNaN(value) &&
                  value >= 0 &&
                  value <= examSessionQuestion.points
                ) {
                  setPoints(value);
                }
              }}
              className="h-8 w-24 text-center"
            />
          </div>
          <p className="text-muted-foreground text-xs">
            (out of {examSessionQuestion.points || 0})
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
                examSessionQuestion.question.type ===
                  QuestionType.MultipleChoiceSingle ||
                examSessionQuestion.question.type === QuestionType.TrueFalse
              ) {
                return (
                  <div>
                    {examSessionQuestion.answer?.choices.map(
                      (choice: AnswerChoice) => (
                        <div key={choice.questionChoiceId}>
                          {getQuestionTypeText(
                            examSessionQuestion.points,
                            examSessionQuestion.points || 0,
                            choice.text || "",
                          )}
                        </div>
                      ),
                    )}
                  </div>
                );
              } else if (
                examSessionQuestion.question.type ===
                QuestionType.MultipleChoiceMultiple
              ) {
                return (
                  <ul className="list-disc pl-4">
                    {examSessionQuestion.answer?.choices.map(
                      (choice: AnswerChoice) => (
                        <li key={choice.questionChoiceId}>
                          {getQuestionTypeText(
                            examSessionQuestion.points,
                            examSessionQuestion.points || 0,
                            choice.text || "",
                          )}
                        </li>
                      ),
                    )}
                  </ul>
                );
              } else if (
                examSessionQuestion.question.type === QuestionType.DragAndDrop
              ) {
                return (
                  <ol className="list-decimal pl-4">
                    {examSessionQuestion.answer?.choices
                      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                      .map((choice: AnswerChoice) => (
                        <li key={choice.questionChoiceId}>
                          {getQuestionTypeText(
                            examSessionQuestion.points,
                            examSessionQuestion.points || 0,
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
                examSessionQuestion.question.type ===
                  QuestionType.MultipleChoiceSingle ||
                examSessionQuestion.question.type === QuestionType.TrueFalse
              ) {
                return (
                  <div>
                    {examSessionQuestion?.question?.choices
                      .filter((choice) => choice.isCorrect)
                      .map((choice) => (
                        <div key={choice.id}>
                          {getQuestionTypeText(
                            examSessionQuestion.points,
                            examSessionQuestion.points,
                            choice.text || "",
                          )}
                        </div>
                      ))}
                  </div>
                );
              } else if (
                examSessionQuestion.question.type ===
                QuestionType.MultipleChoiceMultiple
              ) {
                return (
                  <ul className="list-disc pl-4">
                    {examSessionQuestion?.question?.choices
                      .filter((choice) => choice.isCorrect)
                      .map((choice) => (
                        <li key={choice.id}>
                          {getQuestionTypeText(
                            examSessionQuestion.points,
                            examSessionQuestion.points,
                            choice.text || "",
                          )}
                        </li>
                      ))}
                  </ul>
                );
              } else if (
                examSessionQuestion.question.type === QuestionType.DragAndDrop
              ) {
                return (
                  <ol className="list-decimal pl-4">
                    {examSessionQuestion?.question?.choices
                      .filter((choice) => choice.isCorrect)
                      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                      .map((choice) => (
                        <li key={choice.id}>
                          {getQuestionTypeText(
                            examSessionQuestion.points,
                            examSessionQuestion.points,
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
