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
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import ResourceCard from "@/components/admin/resources/ResourceCard";
import { QuestionType } from "@/lib/types/questions";
import useTimer from "@/hooks/timer/useTimer";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ExamSessionResponse } from "@/lib/types/exam-session";
import { useExamSessionStore } from "@/lib/stores/exam-session-store";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useGenerateQuestionHint from "@/hooks/exam-sessions/useGenerateQuestionHint";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { CreateAnswerRequest } from "@/lib/types/answer";
import {
  ExamSessionQuestionResponse,
  RewriteDifficulty,
} from "@/lib/types/exam-session-question";
import useGetExamSessionQuestionCorrectAnswer from "@/hooks/exam-sessions/useGetExamSessionQuestionAnswer";
import { useRewriteQuestionText } from "@/hooks/exam-sessions/useRewriteQuestionText";

type QuestionBoxProps = {
  examSessionQuestion: ExamSessionQuestionResponse;
  examSession: ExamSessionResponse;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  disabledNextButton: boolean;
  answer: CreateAnswerRequest;
  setAnswer: (answer: CreateAnswerRequest) => void;
  isUpdatingProgress: boolean;
  isReadyToSubmit: boolean;
  showSubmitDialog: () => void;
  isPaused: boolean;
};

export default function QuestionBox({
  examSessionQuestion,
  examSession,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  disabledNextButton,
  answer,
  setAnswer,
  isUpdatingProgress,
  isReadyToSubmit,
  showSubmitDialog,
  isPaused,
}: QuestionBoxProps) {
  const {
    flaggedQuestions,
    addFlaggedQuestion,
    removeFlaggedQuestion,
    lastSavedTime,
    hints,
    setHint,
    correctAnswers,
    setCorrectAnswers,
    showCorrectAnswers,
    setShowCorrectAnswers,
    questionText,
    setQuestionText,
  } = useExamSessionStore();
  const { generateHint, isPending: isGeneratingHint } =
    useGenerateQuestionHint();
  const enableHints = examSession?.settings.enableHints;
  const enableViewAnswer = examSession?.settings.enableViewAnswer;
  const currentHint = enableHints ? hints[examSessionQuestion.id] : "";

  const [currentQuestionText, setCurrentQuestionText] = useState<string>(
    examSessionQuestion.question.text,
  );

  const { getCorrectAnswers, isPending: isGettingCorrectAnswers } =
    useGetExamSessionQuestionCorrectAnswer();
  const { rewriteQuestion, isPending: isRewritingQuestion } =
    useRewriteQuestionText();

  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [choiceOrder, setChoiceOrder] = useState<string[]>([]);
  const [correctChoiceIds, setCorrectChoiceIds] = useState<
    { questionChoiceId: string; order?: number }[]
  >([]);
  const initialSeconds = examSessionQuestion.timeSpentSeconds || 0;

  const { seconds, resetTimer } = useTimer({
    initialSeconds,
    isRunning: !isPaused,
    onTimeUpdate: (currentSeconds) => {
      if (
        examSessionQuestion.question.type === QuestionType.DragAndDrop &&
        answer.choices.length === 0
      ) {
        return;
      }

      setAnswer({
        ...answer,
        examSessionQuestionId: examSessionQuestion.id,
        timeSpentSeconds: currentSeconds,
        toBeReviewed: false,
      });
    },
  });

  const handleGenerateHint = async () => {
    if (!enableHints) {
      toast.error("Hints are not enabled for this exam.");
      return;
    }

    if (hints[examSessionQuestion.id]) {
      return;
    }
    try {
      const hint = await generateHint({
        examSessionId: examSession.id,
        questionId: examSessionQuestion.id,
      });
      setHint(examSessionQuestion.id, hint);
    } catch {
      toast.error("Error generating hint. Please try again.");
    }
  };

  const handleViewAnswer = async () => {
    if (correctAnswers[examSessionQuestion.id]) {
      setShowCorrectAnswers(examSessionQuestion.id, true);
      setCorrectChoiceIds(
        correctAnswers[examSessionQuestion.id].map((c) => ({
          questionChoiceId: c.questionChoiceId,
          order: c.order,
        })),
      );
      return;
    }

    try {
      const fetchedCorrectAnswers = await getCorrectAnswers({
        examSessionId: examSession.id,
        examSessionQuestionId: examSessionQuestion.id,
      });

      setCorrectAnswers(examSessionQuestion.id, fetchedCorrectAnswers);
      setShowCorrectAnswers(examSessionQuestion.id, true);
      setCorrectChoiceIds(
        fetchedCorrectAnswers.map((c) => ({
          questionChoiceId: c.questionChoiceId,
          order: c.order,
        })),
      );
    } catch {
      toast.error("Error fetching correct answers. Please try again.");
    }
  };

  const handleRewriteQuestion = async (
    difficulty: RewriteDifficulty | "none",
  ) => {
    if (difficulty === "none") {
      setQuestionText(
        examSessionQuestion.id,
        examSessionQuestion.question.text,
        "none",
      );
      setCurrentQuestionText(examSessionQuestion.question.text);
      return;
    }

    try {
      const rewrittenQuestion = await rewriteQuestion({
        examSessionId: examSession.id,
        questionId: examSessionQuestion.id,
        difficulty,
      });
      setQuestionText(
        examSessionQuestion.id,
        rewrittenQuestion.text,
        difficulty,
      );
      setCurrentQuestionText(rewrittenQuestion.text);
    } catch {
      toast.error("Error rewriting question. Please try again.");
    }
  };

  const handleResetAnswer = () => {
    setSelectedChoices([]);
    setChoiceOrder([]);

    if (examSessionQuestion.question.type === QuestionType.DragAndDrop) {
      const defaultOrder = examSessionQuestion.question.choices.map(
        (c) => c.id,
      );
      setChoiceOrder(defaultOrder);
      setSelectedChoices(defaultOrder);

      setAnswer({
        ...answer,
        examSessionQuestionId: examSessionQuestion.id,
        choices: examSessionQuestion.question.choices.map((choice, index) => ({
          questionChoiceId: choice.id,
          order: index,
        })),
      });
    } else {
      setAnswer({
        ...answer,
        examSessionQuestionId: examSessionQuestion.id,
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
    setHint(examSessionQuestion.id, hints[examSessionQuestion.id] || "");
    setCorrectChoiceIds(
      correctAnswers[examSessionQuestion.id]?.map((c) => ({
        questionChoiceId: c.questionChoiceId,
        order: c.order,
      })) || [],
    );
    if (questionText[examSessionQuestion.id]) {
      setCurrentQuestionText(questionText[examSessionQuestion.id].text);
    } else {
      setCurrentQuestionText(examSessionQuestion.question.text);
    }
  }, [examSessionQuestion.id]);

  // Reset selections and timer when question changes
  useEffect(() => {
    const isCorrectAnswer =
      answer?.examSessionQuestionId === examSessionQuestion.id;
    const currentChoices = isCorrectAnswer ? answer?.choices || [] : [];

    // Check if this is a valid existing answer with choices
    const hasValidChoices =
      currentChoices.length > 0 &&
      currentChoices.every((choice) => choice.questionChoiceId);

    if (hasValidChoices) {
      setSelectedChoices(currentChoices.map((c) => c.questionChoiceId));
      if (examSessionQuestion.question.type === QuestionType.DragAndDrop) {
        const orderedChoices = currentChoices
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((c) => c.questionChoiceId);
        setChoiceOrder(orderedChoices);
      }
    } else {
      setSelectedChoices([]);

      if (examSessionQuestion.question.type === QuestionType.DragAndDrop) {
        const defaultOrder = examSessionQuestion.question.choices.map(
          (c) => c.id,
        );
        setChoiceOrder(defaultOrder);
        setSelectedChoices(defaultOrder);

        setAnswer({
          ...answer,
          examSessionQuestionId: examSessionQuestion.id,
          choices: examSessionQuestion.question.choices.map(
            (choice, index) => ({
              questionChoiceId: choice.id,
              order: index,
            }),
          ),
        });
      } else {
        setChoiceOrder([]);
      }
    }
  }, [examSessionQuestion.id, answer?.examSessionQuestionId]);

  const handleSingleChoiceSelection = (value: string) => {
    setSelectedChoices([value]);
    setAnswer({
      ...answer,
      examSessionQuestionId: examSessionQuestion.id,
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
      examSessionQuestionId: examSessionQuestion.id,
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
        examSessionQuestionId: examSessionQuestion.id,
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
  }, [examSessionQuestion.id, answer?.timeSpentSeconds, resetTimer]);

  const isFlagged = flaggedQuestions.includes(examSessionQuestion.id);

  if (!examSessionQuestion) {
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
    if (!examSessionQuestion) {
      return null;
    }

    switch (examSessionQuestion.question.type) {
      case QuestionType.MultipleChoiceSingle:
        return (
          <RadioGroup
            value={selectedChoices[0] || ""}
            onValueChange={handleSingleChoiceSelection}
            className="space-y-2"
          >
            {examSessionQuestion.question.choices.map((choice) => (
              <div
                key={choice.id}
                className={cn(
                  "flex items-center space-x-2 rounded-md border p-3",
                  correctChoiceIds?.some(
                    (c) => c.questionChoiceId === choice.id,
                  ) &&
                    showCorrectAnswers[examSessionQuestion.id] &&
                    "border-green-500 bg-green-50",
                )}
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
            {examSessionQuestion.question.choices.map((choice) => (
              <div
                key={choice.id}
                className={cn(
                  "flex items-center space-x-2 rounded-md border p-3",
                  correctChoiceIds?.some(
                    (c) => c.questionChoiceId === choice.id,
                  ) &&
                    showCorrectAnswers[examSessionQuestion.id] &&
                    "border-green-500 bg-green-50",
                )}
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
            {examSessionQuestion.question.choices.map((choice) => (
              <div
                key={choice.id}
                className={cn(
                  "flex items-center space-x-2 rounded-md border p-3",
                  correctChoiceIds?.some(
                    (c) => c.questionChoiceId === choice.id,
                  ) &&
                    showCorrectAnswers[examSessionQuestion.id] &&
                    "border-green-500 bg-green-50",
                )}
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
                  const choice = examSessionQuestion.question.choices.find(
                    (c) => c.id === choiceId,
                  );
                  if (!choice) return null;

                  const order =
                    showCorrectAnswers[examSessionQuestion.id] &&
                    correctChoiceIds.some(
                      (c) => c.questionChoiceId === choiceId,
                    )
                      ? correctAnswers[examSessionQuestion.id].find(
                          (c) => c.questionChoiceId === choiceId,
                        )?.order
                      : undefined;

                  return (
                    <SortableItem
                      key={choiceId}
                      id={choiceId}
                      text={choice.text}
                      order={order}
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
      <div className="flex flex-col gap-2">
        <div className="flex flex-col-reverse items-center justify-between gap-y-2 md:flex-row">
          <div className="flex flex-col items-center md:flex-row">
            <h2 className="text-base font-bold md:text-lg">
              {currentQuestionText}
            </h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (isFlagged) {
                        removeFlaggedQuestion(examSessionQuestion.id);
                      } else {
                        addFlaggedQuestion(examSessionQuestion.id);
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
        <div className="flex flex-row flex-wrap items-center gap-1.5">
          <Button
            variant="outline"
            className="h-fit w-fit rounded-xl px-2 py-1 text-xs"
            onClick={() => handleRewriteQuestion("easier")}
            disabled={isRewritingQuestion}
          >
            Make this easier
          </Button>
          <Button
            variant="outline"
            className="h-fit w-fit rounded-xl px-2 py-1 text-xs"
            onClick={() => handleRewriteQuestion("harder")}
            disabled={isRewritingQuestion}
          >
            Make this harder
          </Button>
          <Button
            variant="outline"
            className="h-fit w-fit rounded-xl px-2 py-1 text-xs"
            onClick={() => handleRewriteQuestion("same")}
            disabled={isRewritingQuestion}
          >
            Rephrase
          </Button>
          <Button
            variant="outline"
            className="h-fit w-fit rounded-xl px-2 py-1 text-xs"
            onClick={() => handleRewriteQuestion("none")}
            disabled={isRewritingQuestion}
          >
            Reset
          </Button>
        </div>
        {examSessionQuestion.question.description && (
          <p className="text-muted-foreground text-xs md:text-sm">
            {examSessionQuestion.question.description}
          </p>
        )}
      </div>

      <div className="flex-1">
        <div className="flex flex-col gap-6">
          {/* Question */}
          <div className="flex flex-col gap-4">{renderQuestionContent()}</div>
          {/* Actions */}
          <div className="flex flex-row flex-wrap items-center gap-4">
            <Button
              variant="outline"
              className="w-fit"
              onClick={handleResetAnswer}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset question
            </Button>
            {enableHints && (
              <Button
                variant="outline"
                className="w-fit"
                onClick={handleGenerateHint}
                disabled={isGeneratingHint || !!currentHint}
              >
                <LightBulbIcon className="mr-2 h-4 w-4" />
                Generate hint
              </Button>
            )}
            {enableViewAnswer &&
              !showCorrectAnswers[examSessionQuestion.id] && (
                <Button
                  variant="outline"
                  className="w-fit"
                  onClick={handleViewAnswer}
                  disabled={isGettingCorrectAnswers}
                >
                  <EyeIcon className="mr-2 h-4 w-4" />
                  View answer
                </Button>
              )}
            {enableViewAnswer && showCorrectAnswers[examSessionQuestion.id] && (
              <Button
                variant="outline"
                className="w-fit"
                onClick={() =>
                  setShowCorrectAnswers(examSessionQuestion.id, false)
                }
              >
                <EyeOffIcon className="mr-2 h-4 w-4" />
                Hide answers
              </Button>
            )}
          </div>
          {/* Hint */}
          {enableHints && currentHint && (
            <div className="flex flex-row rounded-md border bg-green-50 p-3">
              <LightBulbIcon className="mr-2 h-4 w-4" />
              <p className="text-muted-foreground text-xs md:text-sm">
                {currentHint}
              </p>
            </div>
          )}
        </div>
      </div>

      {examSessionQuestion.question.resources &&
        examSessionQuestion.question.resources.length > 0 && (
          <div className="mt-4">
            <h3 className="mb-2 font-medium">Resources</h3>
            <div className="grid grid-cols-1 gap-2 xl:grid-cols-3">
              {examSessionQuestion.question.resources.map((resource) => (
                <ResourceCard
                  key={`${examSessionQuestion.id}-${resource.id}`}
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

function SortableItem({
  id,
  text,
  order,
}: {
  id: string;
  text: string;
  order?: number;
}) {
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
      className="bg-background flex items-center justify-between gap-2 rounded-md border p-3"
      {...attributes}
    >
      <div className="flex flex-row items-center gap-2">
        <Button
          variant="ghost"
          {...listeners}
          className="cursor-grab touch-manipulation"
        >
          <GripVertical size={16} />
        </Button>
        <span>{text}</span>
      </div>
      {order !== undefined && (
        <div className="flex flex-row items-center gap-2 rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white">
          {order + 1}
        </div>
      )}
    </div>
  );
}
