import { ExamSessionQuestionResult } from "@/lib/types/exam-session";
import { QuestionType } from "@/lib/types/questions";
import { cn } from "@/lib/utils";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";

export function QuestionResult({
  question,
  index,
}: {
  question: ExamSessionQuestionResult;
  index: number;
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
          `text-start font-bold md:text-lg`,
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
    <AccordionItem
      value={question.id}
      className="border-t-primary/20 w-full flex-row gap-y-4"
    >
      <AccordionTrigger className="flex w-full flex-col items-start justify-between px-8 md:flex-row md:items-center">
        <div className="flex h-full flex-col items-center p-0">
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
          <div className="flex flex-col items-start gap-x-2 md:flex-row md:items-center">
            <p className="text-sm font-bold md:text-base">
              Question {index + 1}
            </p>
            <p className="text-muted-foreground text-xs font-light">
              (Scored{" "}
              {question.answer?.isCorrect
                ? `${question.answer?.points || 0}`
                : "0"}{" "}
              out of {question.points || 0})
            </p>
          </div>

          <p className="text-muted-foreground text-xs md:text-sm">
            {question.text}
          </p>
        </div>
      </AccordionTrigger>
      <AccordionContent className="bg-accent flex w-full flex-col items-start px-8 py-4">
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
      </AccordionContent>

      <div className="flex flex-col items-start"></div>
    </AccordionItem>
  );
}
