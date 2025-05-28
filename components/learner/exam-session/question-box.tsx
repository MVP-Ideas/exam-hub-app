"use client";

import { useState, useEffect, useCallback } from "react";
import { BeatLoader } from "react-spinners";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Clock,
  ArrowLeft,
  ArrowRight,
  RefreshCcw,
  Flag,
} from "lucide-react";
import { QuestionType } from "@/lib/types/questions";
import useExamSessionQuestionByQuestionId from "@/hooks/exam-sessions/useExamSessionQuestionByQuestionId";
import useAnswerQuestion from "@/hooks/exam-sessions/useAnswerQuestion";
import useTimer from "@/hooks/timer/useTimer";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ExamSessionAnswerCreate } from "@/lib/types/exam-session";
import useResetAnswer from "@/hooks/exam-sessions/useResetAnswer";
import { useExamSessionStore } from "@/lib/stores/exam-session-store";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import useDebouncedValue from "@/hooks/common/useDebouncedValue";

type QuestionBoxProps = {
  examSessionId: string;
  questionId: string;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  disabledNextButton: boolean;
};

export default function QuestionBox({
  examSessionId,
  questionId,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  disabledNextButton,
}: QuestionBoxProps) {
  const { flaggedQuestions, addFlaggedQuestion, removeFlaggedQuestion } =
    useExamSessionStore();
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [choiceOrder, setChoiceOrder] = useState<string[]>([]);

  const { answerQuestion, isPending: isSubmitting } = useAnswerQuestion();
  const { resetAnswer } = useResetAnswer(examSessionId, questionId);
  const [answerData, setAnswerData] = useState<ExamSessionAnswerCreate | null>(
    null,
  );

  const debouncedAnswerData = useDebouncedValue(answerData, 500);

  const { question, isLoading, isError } = useExamSessionQuestionByQuestionId(
    examSessionId,
    questionId,
  );

  const initialSeconds = question?.timeSpentSeconds || 0;

  const { seconds, formatTime, resetTimer } = useTimer({
    initialSeconds,
  });

  const getAnswerChoices = useCallback(() => {
    if (!question?.type) {
      return [];
    }

    switch (question.type) {
      case QuestionType.MultipleChoiceSingle:
      case QuestionType.TrueFalse:
        return selectedChoices.map((choiceId) => ({
          questionChoiceId: choiceId,
        }));

      case QuestionType.MultipleChoiceMultiple:
        return selectedChoices.map((choiceId) => ({
          questionChoiceId: choiceId,
        }));

      case QuestionType.DragAndDrop:
        return choiceOrder.map((choiceId, index) => ({
          questionChoiceId: choiceId,
          order: index,
        }));

      default:
        return [];
    }
  }, [question, selectedChoices, choiceOrder]);

  const submitAnswer = useCallback(async () => {
    if (!question || isSubmitting) return;

    try {
      await answerQuestion({
        examSessionId: examSessionId,
        questionId: questionId,
        answer: {
          choices: getAnswerChoices(),
          aiAssitanceUsed: false,
          timeSpentSeconds: seconds,
          toBeReviewed: false,
        },
      });
    } catch (error) {
      toast.error("Failed to submit answer");
      console.error("Failed to submit answer:", error);
    }
  }, [
    examSessionId,
    isSubmitting,
    question,
    questionId,
    answerQuestion,
    seconds,
    getAnswerChoices,
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  // Reset selections and timer when question changes
  useEffect(() => {
    setSelectedChoices([]);
    if (question) {
      const choiceIds = question.choices.map((c) => c.id);
      setChoiceOrder(choiceIds);

      if (question.answer && question.answer.timeSpentSeconds > 0) {
        resetTimer(question.answer.timeSpentSeconds);
      } else if (seconds === 0) {
        resetTimer(0);
      }

      if (!question.answer && question.type === QuestionType.DragAndDrop) {
        setChoiceOrder(choiceIds);
        setAnswerData({
          choices: choiceIds.map((choiceId) => ({
            questionChoiceId: choiceId,
          })),
          aiAssitanceUsed: false,
          toBeReviewed: false,
          timeSpentSeconds: seconds - initialSeconds,
        });
      }

      if (question.answer && question.answer.choices.length > 0) {
        if (question.type === QuestionType.DragAndDrop) {
          // Sort the choice IDs based on the order from the answer
          const sortedChoices = [...question.answer.choices]
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((c) => c.questionChoiceId);

          if (sortedChoices.length > 0) {
            setChoiceOrder(sortedChoices);
          }
        } else {
          // For other question types, set the selected choices
          setSelectedChoices(
            question.answer.choices.map((c) => c.questionChoiceId),
          );
        }
      }
    } else {
      setChoiceOrder([]);
    }
  }, [question]);

  const handleSingleChoiceSelection = (value: string) => {
    setSelectedChoices([value]);
    setAnswerData({
      choices: [{ questionChoiceId: value }],
      aiAssitanceUsed: false,
      toBeReviewed: false,
      timeSpentSeconds: seconds - initialSeconds,
    });
  };

  const handleMultipleChoiceSelection = (value: string, isChecked: boolean) => {
    let newChoices;
    if (isChecked) {
      newChoices = [...selectedChoices, value];
      setSelectedChoices(newChoices);
    } else {
      newChoices = selectedChoices.filter((id) => id !== value);
      setSelectedChoices(newChoices);
    }
    setAnswerData({
      choices: newChoices.map((choiceId) => ({ questionChoiceId: choiceId })),
      aiAssitanceUsed: false,
      toBeReviewed: false,
      timeSpentSeconds: seconds - initialSeconds,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = choiceOrder.indexOf(active.id as string);
      const newIndex = choiceOrder.indexOf(over.id as string);

      // Use arrayMove helper from dnd-kit
      const newOrder = arrayMove(choiceOrder, oldIndex, newIndex);
      setChoiceOrder(newOrder);
      setAnswerData({
        choices: newOrder.map((choiceId, index) => ({
          questionChoiceId: choiceId,
          order: index,
        })),
        aiAssitanceUsed: false,
        timeSpentSeconds: seconds - initialSeconds,
        toBeReviewed: false,
      });
    }
  };

  const isFlagged = flaggedQuestions.includes(questionId);

  useEffect(() => {
    if (!debouncedAnswerData || isSubmitting) return;

    const submit = async () => {
      try {
        await answerQuestion({
          examSessionId,
          questionId,
          answer: debouncedAnswerData,
        });
        setAnswerData(null);
      } catch (error) {
        toast.error("Failed to submit answer");
        console.error("Submit error:", error);
      }
    };

    submit();
  }, [debouncedAnswerData]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <BeatLoader />
      </div>
    );
  }

  if (isError || !question) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex w-full max-w-md flex-col items-center justify-center gap-y-2 text-center">
          <p className="text-destructive">Error loading question</p>
          <p className="text-muted-foreground">
            Please check your internet connection and try again.
          </p>
        </div>
      </div>
    );
  }

  const renderQuestionContent = () => {
    switch (question.type) {
      case QuestionType.MultipleChoiceSingle:
        return (
          <RadioGroup
            value={selectedChoices[0] || ""}
            onValueChange={handleSingleChoiceSelection}
            className="space-y-2"
          >
            {question.choices.map((choice) => (
              <div
                key={choice.id}
                className="flex items-center space-x-2 rounded-md border p-3"
              >
                <RadioGroupItem value={choice.id} id={choice.id} />
                <Label htmlFor={choice.id} className="w-full cursor-pointer">
                  {choice.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case QuestionType.MultipleChoiceMultiple:
        return (
          <div className="space-y-2">
            {question.choices.map((choice) => (
              <div
                key={choice.id}
                className="flex items-center space-x-2 rounded-md border p-3"
              >
                <Checkbox
                  id={choice.id}
                  checked={selectedChoices.includes(choice.id)}
                  onCheckedChange={(checked) =>
                    handleMultipleChoiceSelection(choice.id, !!checked)
                  }
                />
                <Label htmlFor={choice.id} className="w-full cursor-pointer">
                  {choice.text}
                </Label>
              </div>
            ))}
          </div>
        );

      case QuestionType.TrueFalse:
        return (
          <RadioGroup
            value={selectedChoices[0] || ""}
            onValueChange={handleSingleChoiceSelection}
            className="space-y-2"
          >
            {question.choices.map((choice) => (
              <div
                key={choice.id}
                className="flex items-center space-x-2 rounded-md border p-3"
              >
                <RadioGroupItem value={choice.id} id={choice.id} />
                <Label htmlFor={choice.id} className="w-full cursor-pointer">
                  {choice.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case QuestionType.DragAndDrop:
        return (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={choiceOrder}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {choiceOrder.map((choiceId) => {
                  const choice = question.choices.find(
                    (c) => c.id === choiceId,
                  );
                  if (!choice) return null;

                  return (
                    <SortableItem
                      key={choiceId}
                      id={choiceId}
                      text={choice.text}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        );

      default:
        return (
          <div className="text-muted-foreground flex flex-col items-center justify-center p-4">
            <p>Unsupported question type</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full w-full flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col-reverse items-center justify-between gap-y-2 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:flex-row">
            <h2 className="text-base font-bold md:text-lg">{question.text}</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (isFlagged) {
                        removeFlaggedQuestion(questionId);
                      } else {
                        addFlaggedQuestion(questionId);
                      }
                    }}
                  >
                    <Flag
                      className={cn(
                        "h-4 w-4",
                        isFlagged
                          ? "text-destructive font-bold"
                          : "text-muted-foreground",
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {isFlagged ? "Unflag question" : "Flag question"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground hidden md:block">
              Time spent:
            </span>
            <span className="font-mono">{formatTime()}</span>
          </div>
        </div>
        {question.description && (
          <p className="text-muted-foreground text-xs md:text-sm">
            {question.description}
          </p>
        )}
      </div>

      <div className="flex-1">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">{renderQuestionContent()}</div>
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              className="w-fit"
              onClick={() => {
                // Reset selected choices and order
                setSelectedChoices([]);
                setChoiceOrder([]);
                resetAnswer();
              }}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset question
            </Button>
          </div>
        </div>
      </div>

      {question.resources && question.resources.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 font-medium">Resources</h3>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {question.resources.map((resource) => (
              <div
                key={`${questionId}-${resource.id}`}
                className="rounded-md border p-3"
              >
                <p className="font-medium">{resource.title}</p>
                <p className="text-muted-foreground text-sm">{resource.type}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Footer */}
      <footer className="flex w-full flex-row items-center justify-between p-4">
        <Button
          variant="outline"
          className="px-4 font-semibold"
          onClick={() => {
            submitAnswer();
            setCurrentQuestionIndex(currentQuestionIndex - 1);
          }}
          disabled={currentQuestionIndex === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="secondary"
          className="px-4 font-semibold"
          onClick={() => {
            submitAnswer();
            setCurrentQuestionIndex(currentQuestionIndex + 1);
          }}
          disabled={disabledNextButton}
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </footer>
    </div>
  );
}

function SortableItem({ id, text }: { id: string; text: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-md border bg-white p-3"
      {...attributes}
    >
      <Button
        variant="ghost"
        {...listeners}
        className="cursor-grab touch-manipulation"
      >
        <GripVertical size={16} />
      </Button>
      <span>{text}</span>
    </div>
  );
}
