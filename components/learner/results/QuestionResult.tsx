import { ExamSessionQuestionResultResponse } from "@/lib/types/exam-session-question";
import { QuestionType } from "@/lib/types/questions";
import { cn } from "@/lib/utils";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon, SparklesIcon, XCircleIcon } from "lucide-react";
import { AnswerChoice } from "@/lib/types/answer-choice";
import { QuestionChoiceResultResponse } from "@/lib/types/question-choice";
import { LightBulbIcon } from "@heroicons/react/24/outline";

export function QuestionResult({
  question: examSessionQuestion,
  index,
}: {
  question: ExamSessionQuestionResultResponse;
  index: number;
}) {
  const correctType = (questionPoints: number, answerPoints: number) => {
    if (questionPoints === answerPoints) {
      return "Correct";
    } else if (answerPoints > 0) {
      return "PartiallyCorrect";
    } else {
      return "Incorrect";
    }
  };

  const renderUserAnswerChoices = (choices: AnswerChoice[]) => {
    const question = examSessionQuestion.question;
    const questionType = question.type;
    const isQuestionCorrect = question.points === examSessionQuestion.points;

    if (
      questionType === QuestionType.MultipleChoiceSingle ||
      questionType === QuestionType.TrueFalse
    ) {
      return (
        <div className="flex w-full flex-col items-start">
          {choices.map((choice: AnswerChoice) => {
            const explanation = question.choices.find(
              (c) => c.id === choice.questionChoiceId,
            )?.explanation;

            return (
              <AnswerItem
                key={choice.questionChoiceId}
                isCorrect={isQuestionCorrect}
                showBullet={true}
                title={choice.text || ""}
                explanation={explanation}
              />
            );
          })}
        </div>
      );
    } else if (questionType === QuestionType.MultipleChoiceMultiple) {
      return (
        <div className="flex w-full flex-col items-start">
          {choices.map((choice: AnswerChoice) => {
            const isChoiceCorrect = question.choices.some(
              (c) => c.id === choice.questionChoiceId && c.isCorrect,
            );
            const explanation = question.choices.find(
              (c) => c.id === choice.questionChoiceId,
            )?.explanation;

            return (
              <AnswerItem
                key={choice.questionChoiceId}
                isCorrect={isChoiceCorrect}
                showBullet={true}
                title={choice.text || ""}
                explanation={explanation}
              />
            );
          })}
          {/* If wrong, show missing correct choices only */}
          {(() => {
            const missingCorrectChoices = question.choices.filter(
              (c) =>
                c.isCorrect &&
                !choices.some((choice) => choice.questionChoiceId === c.id),
            );

            if (missingCorrectChoices.length > 0) {
              return missingCorrectChoices.map((choice) => {
                return (
                  <AnswerItem
                    key={choice.id}
                    isCorrect={false}
                    showBullet={true}
                    title={`Missing: ${choice.text || ""}`}
                    explanation={choice.explanation}
                    showCorrectnessSign={false}
                  />
                );
              });
            }
            return null;
          })()}
        </div>
      );
    } else if (questionType === QuestionType.DragAndDrop) {
      return (
        <div className="flex w-full flex-col items-start">
          {choices
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((choice: AnswerChoice, index) => {
              const explanation = question.choices.find(
                (c) => c.id === choice.questionChoiceId,
              )?.explanation;

              return (
                <AnswerItem
                  key={choice.questionChoiceId}
                  isCorrect={isQuestionCorrect}
                  showBullet={false}
                  number={index + 1}
                  title={choice.text || ""}
                  explanation={explanation}
                />
              );
            })}
        </div>
      );
    }
    return null;
  };

  const renderCorrectAnswerChoices = (
    choices: QuestionChoiceResultResponse[],
  ) => {
    const questionType = examSessionQuestion.question.type;

    if (
      questionType === QuestionType.MultipleChoiceSingle ||
      questionType === QuestionType.TrueFalse
    ) {
      return (
        <div className="flex w-full flex-col items-start">
          {choices.map((choice: QuestionChoiceResultResponse) => {
            return (
              <AnswerItem
                key={choice.id}
                isCorrect={choice.isCorrect}
                showBullet={true}
                title={choice.text || ""}
                explanation={choice.explanation}
                showCorrectnessSign={false}
              />
            );
          })}
        </div>
      );
    } else if (questionType === QuestionType.MultipleChoiceMultiple) {
      return (
        <div className="flex w-full flex-col items-start">
          {choices.map((choice: QuestionChoiceResultResponse) => {
            return (
              <AnswerItem
                key={choice.id}
                isCorrect={choice.isCorrect}
                showBullet={true}
                title={choice.text || ""}
                explanation={choice.explanation}
                showCorrectnessSign={false}
              />
            );
          })}
        </div>
      );
    } else if (questionType === QuestionType.DragAndDrop) {
      return (
        <div className="flex w-full flex-col items-start">
          {choices
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((choice: QuestionChoiceResultResponse, index) => {
              return (
                <AnswerItem
                  key={choice.id}
                  isCorrect={choice.isCorrect}
                  showBullet={false}
                  number={index + 1}
                  title={choice.text || ""}
                  explanation={choice.explanation}
                  showCorrectnessSign={false}
                />
              );
            })}
        </div>
      );
    }
    return null;
  };

  const renderAccordionContent = () => {
    return (
      <AccordionContent className="flex w-full flex-col items-start px-8 py-4">
        <div className="flex w-full flex-col items-start gap-y-4 pl-1">
          <div className="flex w-full flex-col items-start">
            {/* User Answer */}
            <div className="flex w-full flex-row items-center justify-start gap-x-2 py-2">
              <p className="text-muted-foreground text-xs md:text-sm">
                Your Answer
              </p>
            </div>

            {examSessionQuestion.answer?.choices &&
              renderUserAnswerChoices(examSessionQuestion.answer.choices)}
          </div>

          {/* Correct Answer */}
          {!examSessionQuestion.isCorrect && (
            <div className="flex w-full flex-col items-start">
              <p className="text-muted-foreground mb-2 text-xs md:text-sm">
                Correct Answer
              </p>
              {examSessionQuestion?.question?.choices &&
                renderCorrectAnswerChoices(
                  examSessionQuestion.question.choices.filter(
                    (choice) => choice.isCorrect,
                  ),
                )}
            </div>
          )}
        </div>
      </AccordionContent>
    );
  };

  return (
    <AccordionItem
      value={examSessionQuestion.id}
      className="border-t-primary/20 w-full flex-row gap-y-4"
    >
      <AccordionTrigger className="bg-accent flex w-full flex-col items-start justify-between px-8 md:flex-row md:items-center">
        <div className="flex h-full flex-col items-center p-0">
          {correctType(
            examSessionQuestion.question.points,
            examSessionQuestion.points || 0,
          ) === "Correct" ? (
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
          ) : correctType(
              examSessionQuestion.question.points,
              examSessionQuestion.points || 0,
            ) === "PartiallyCorrect" ? (
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
              {examSessionQuestion.isCorrect
                ? `${examSessionQuestion.points || 0}`
                : "0"}{" "}
              out of {examSessionQuestion.question.points || 0})
            </p>
          </div>

          <p className="text-muted-foreground text-xs md:text-sm">
            {examSessionQuestion.question.text}
          </p>

          {examSessionQuestion.aiAssistanceUsed && (
            <div className="my-1 flex flex-row items-center gap-x-2 rounded-md border border-orange-500 bg-orange-50 px-4 py-1">
              <LightBulbIcon className="h-4 w-4 text-orange-500" />
              <p className="text-xs text-orange-500">Used hint</p>
            </div>
          )}
        </div>
      </AccordionTrigger>

      {renderAccordionContent()}

      <div className="flex flex-col items-start"></div>
    </AccordionItem>
  );
}
const AnswerItem = ({
  isCorrect,
  showBullet,
  number,
  title,
  explanation,
  showCorrectnessSign = true,
}: {
  isCorrect: boolean;
  showBullet: boolean;
  number?: number;
  title: string;
  explanation?: string;
  showCorrectnessSign?: boolean;
}) => {
  return (
    <div
      className={cn(
        "mb-2 w-full rounded-md border-l-4 bg-gray-50 p-3 transition-all duration-200",
        isCorrect
          ? "border-l-green-500 bg-green-50"
          : "border-l-red-500 bg-red-50",
      )}
    >
      <div className="flex w-full items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
            isCorrect ? "bg-green-500" : "bg-red-500",
          )}
        >
          {showBullet ? "•" : number}
        </div>

        <div className="flex w-full flex-col items-start">
          <div className="mb-1 font-medium text-gray-900">{title}</div>

          {explanation && (
            <div className="mt-1.5 text-start text-sm text-gray-600 italic">
              {showCorrectnessSign && (isCorrect ? "✅ Correct! " : "❌ ")}
              {explanation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
