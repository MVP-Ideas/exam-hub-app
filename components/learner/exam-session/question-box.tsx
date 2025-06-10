"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import ResourceCard from "@/components/admin/resources/resource-card";
import { QuestionType } from "@/lib/types/questions";
import useTimer from "@/hooks/timer/useTimer";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  ExamSessionAnswerCreate,
  ExamSessionQuestion,
} from "@/lib/types/exam-session";
import { useExamSessionStore } from "@/lib/stores/exam-session-store";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type QuestionBoxProps = {
  question: ExamSessionQuestion;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  disabledNextButton: boolean;
  answer: ExamSessionAnswerCreate;
  setAnswer: (answer: ExamSessionAnswerCreate) => void;
  isUpdatingProgress: boolean;
  isReadyToSubmit: boolean;
  showSubmitDialog: () => void;
  isPaused: boolean;
};

export default function QuestionBox({
  question,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  disabledNextButton,
  answer,
  setAnswer,
  isUpdatingProgress,
  isReadyToSubmit,
  showSubmitDialog, // Updated prop name
  isPaused,
}: QuestionBoxProps) {
  const {
    flaggedQuestions,
    addFlaggedQuestion,
    removeFlaggedQuestion,
    lastSavedTime,
  } = useExamSessionStore();
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [choiceOrder, setChoiceOrder] = useState<string[]>([]);

  const initialSeconds = answer?.timeSpentSeconds || 0;

  const { seconds, resetTimer } = useTimer({
    initialSeconds,
    isRunning: !isPaused,
    onTimeUpdate: (currentSeconds) => {
      if (
        question.type === QuestionType.DragAndDrop &&
        answer.choices.length === 0
      ) {
        return;
      }

      setAnswer({
        ...answer,
        examSessionQuestionId: question.id,
        timeSpentSeconds: currentSeconds,
      });
    },
  });

  const handleResetAnswer = () => {
    setSelectedChoices([]);
    setChoiceOrder([]);

    if (question.type === QuestionType.DragAndDrop) {
      const defaultOrder = question.choices.map((c) => c.id);
      setChoiceOrder(defaultOrder);
      setSelectedChoices(defaultOrder);

      setAnswer({
        ...answer,
        examSessionQuestionId: question.id,
        choices: question.choices.map((choice, index) => ({
          questionChoiceId: choice.id,
          order: index,
        })),
      });
    } else {
      setAnswer({
        ...answer,
        examSessionQuestionId: question.id,
        choices: [],
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  useEffect(() => {
    setSelectedChoices([]);
    setChoiceOrder([]);
  }, [question.id]);

  // Reset selections and timer when question changes
  useEffect(() => {
    const isCorrectAnswer = answer?.examSessionQuestionId === question.id;
    const currentChoices = isCorrectAnswer ? answer?.choices || [] : [];

    // Check if this is a valid existing answer with choices
    const hasValidChoices =
      currentChoices.length > 0 &&
      currentChoices.every((choice) => choice.questionChoiceId);

    if (hasValidChoices) {
      setSelectedChoices(currentChoices.map((c) => c.questionChoiceId));
      if (question.type === QuestionType.DragAndDrop) {
        const orderedChoices = currentChoices
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((c) => c.questionChoiceId);
        setChoiceOrder(orderedChoices);
      }
    } else {
      setSelectedChoices([]);

      if (question.type === QuestionType.DragAndDrop) {
        const defaultOrder = question.choices.map((c) => c.id);
        setChoiceOrder(defaultOrder);
        setSelectedChoices(defaultOrder);

        setAnswer({
          ...answer,
          examSessionQuestionId: question.id,
          choices: question.choices.map((choice, index) => ({
            questionChoiceId: choice.id,
            order: index,
          })),
        });
      } else {
        setChoiceOrder([]);
      }
    }
  }, [question.id, answer?.examSessionQuestionId]);

  const handleSingleChoiceSelection = (value: string) => {
    setSelectedChoices([value]);
    setAnswer({
      ...answer,
      examSessionQuestionId: question.id,
      timeSpentSeconds: seconds,
      choices: [{ questionChoiceId: value }],
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
    setAnswer({
      ...answer,
      examSessionQuestionId: question.id,
      timeSpentSeconds: seconds,
      choices: newChoices.map((choiceId) => ({
        questionChoiceId: choiceId,
      })),
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
      setAnswer({
        ...answer,
        examSessionQuestionId: question.id,
        timeSpentSeconds: seconds,
        choices: newOrder.map((choiceId, index) => ({
          questionChoiceId: choiceId,
          order: index,
        })),
      });
    }
  };

  useEffect(() => {
    const timeSpent = answer?.timeSpentSeconds || 0;
    resetTimer(timeSpent);
  }, [question.id, answer?.timeSpentSeconds, resetTimer]);

  const isFlagged = flaggedQuestions.includes(question.id);

  if (!question) {
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
    if (!question) {
      return null;
    }

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
                        removeFlaggedQuestion(question.id);
                      } else {
                        addFlaggedQuestion(question.id);
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
              onClick={handleResetAnswer}
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
              <ResourceCard
                key={`${question.id}-${resource.id}`}
                resourceId={resource.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="flex w-full flex-row items-center justify-between p-4">
        <Button
          className="px-4 font-semibold"
          onClick={() => {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
          }}
          disabled={currentQuestionIndex === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <div className="flex flex-row items-center gap-2">
          {lastSavedTime && !isUpdatingProgress && (
            <>
              <div className="flex flex-col items-center gap-1 text-xs">
                <div className="flex flex-row items-center gap-1">
                  <Clock className="text-muted-foreground h-3 w-3" />
                  <span className="text-muted-foreground text-xs">
                    Last saved:
                  </span>
                </div>
                <span className="text-muted-foreground text-xs">
                  {lastSavedTime?.toLocaleString()}
                </span>
              </div>
            </>
          )}
          {isUpdatingProgress && (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span className="text-muted-foreground text-xs">
                Updating progress...
              </span>
            </>
          )}
        </div>
        {isReadyToSubmit && disabledNextButton && (
          <Button className="px-4 font-semibold" onClick={showSubmitDialog}>
            Submit Exam
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
        {!disabledNextButton && (
          <Button
            className="px-4 font-semibold"
            onClick={() => {
              setCurrentQuestionIndex(currentQuestionIndex + 1);
            }}
            disabled={disabledNextButton}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
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
      className="bg-background flex items-center gap-2 rounded-md border p-3"
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
