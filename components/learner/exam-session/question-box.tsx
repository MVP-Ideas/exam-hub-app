"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
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
import { GripVertical, Clock } from "lucide-react";
import { QuestionType } from "@/lib/types/questions";
import useExamSessionQuestionByQuestionId from "@/hooks/exam-sessions/useExamSessionQuestionByQuestionId";
import useAnswerQuestion from "@/hooks/exam-sessions/useAnswerQuestion";
import useUpdateExamProgress from "@/hooks/exam-sessions/useUpdateExamProgress";
import useTimer from "@/hooks/timer/useTimer";
import { getQuestionTypeBadge } from "@/lib/constants/question";
import { Label } from "@/components/ui/label";

type QuestionBoxProps = {
  questionId: string;
};

export default function QuestionBox({ questionId }: QuestionBoxProps) {
  const { id } = useParams();
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [choiceOrder, setChoiceOrder] = useState<string[]>([]);
  const { answerQuestion, isPending: isSubmitting } = useAnswerQuestion();
  const { updateProgress } = useUpdateExamProgress();

  const { question, isLoading, isError } = useExamSessionQuestionByQuestionId(
    id as string,
    questionId,
  );

  const initialSeconds = question?.answer?.timeSpentSeconds || 0;

  const handleTimeUpdate = (newSeconds: number) => {
    // Update server periodically
    if (id && newSeconds > 0 && newSeconds % 30 === 0) {
      updateProgress({
        examSessionId: id as string,
        timeSpentSeconds: newSeconds,
      });
    }
  };

  const { seconds, formatTime, resetTimer } = useTimer({
    initialSeconds,
  });

  const submitAnswer = async () => {
    if (!question || isSubmitting) return;

    try {
      const answerData = {
        choices: getAnswerChoices(),
        aiAssitanceUsed: false,
        timeSpentSeconds: seconds,
        toBeReviewed: false,
      };

      await answerQuestion({
        examSessionId: id as string,
        questionId: questionId,
        answer: answerData,
      });
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
  };

  const getAnswerChoices = () => {
    switch (question?.type) {
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
  };

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
  }, [questionId, question]);

  const handleSingleChoiceSelection = (value: string) => {
    setSelectedChoices([value]);
    // Create answer data directly with the new value instead of relying on state
    const answerData = {
      choices: [{ questionChoiceId: value }],
      aiAssitanceUsed: false,
      timeSpentSeconds: seconds,
      toBeReviewed: false,
    };

    // Submit with the new value directly
    answerQuestion({
      examSessionId: id as string,
      questionId: questionId,
      answer: answerData,
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

    submitAnswer();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = choiceOrder.indexOf(active.id as string);
      const newIndex = choiceOrder.indexOf(over.id as string);

      // Use arrayMove helper from dnd-kit
      const newOrder = arrayMove(choiceOrder, oldIndex, newIndex);
      setChoiceOrder(newOrder);

      // Submit after the state updates
      setTimeout(() => {
        submitAnswer();
      }, 300);
    }
  };

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
    <div className="flex h-full w-full flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <h2 className="text-xl font-bold">{question.text}</h2>
            {getQuestionTypeBadge(question.type as QuestionType)}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground">Time spent:</span>
            <span className="font-mono">{formatTime()}</span>
          </div>
        </div>
        {question.description && (
          <p className="text-muted-foreground">{question.description}</p>
        )}
      </div>

      <div className="flex-1">{renderQuestionContent()}</div>

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
      <button {...listeners} className="cursor-grab touch-manipulation">
        <GripVertical size={16} />
      </button>
      <span>{text}</span>
    </div>
  );
}
