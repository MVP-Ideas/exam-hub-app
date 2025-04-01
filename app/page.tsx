"use client";

import { AppSidebar } from "@/components/home/app-sidebar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Question, QuestionChoice, QuestionType } from "@/lib/types";
import { getAlphabetByOrder } from "@/lib/utils";
import { useQuestionStore } from "@/stores/question-store";

import { ArrowLeft, ArrowRight, BookOpenCheck, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  const {
    questions,
    setQuestions,
    getAnsweredQuestions,
    timer,
    startTimer,
    updateQuestion,
    isOnBreak,
    stopBreak,
    stopTimer,
  } = useQuestionStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentQuestionOrder, setCurrentQuestionOrder] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(
    questions[currentQuestionOrder],
  );

  const getProgress = () => {
    const answeredQuestions = getAnsweredQuestions();
    const totalQuestions = questions.length;

    return (answeredQuestions.length / totalQuestions) * 100;
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    // Pad with 0 if less than 10
    const pad = (num: number) => (num < 10 ? `0${num}` : num);

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const handleChangeQuestion = (order: number) => {
    if (order < 0 || order >= questions.length) return;

    setCurrentQuestionOrder(order);
    setCurrentQuestion(questions[order]);
  };

  const handleResetAnswer = () => {
    const resetChoices = currentQuestion.choices.map((opt) => ({
      ...opt,
      isSelected: false,
    }));

    const updatedQuestion: Question = {
      ...currentQuestion,
      choices: resetChoices,
      isAnswered: false,
    };

    updateQuestion(currentQuestion.order, updatedQuestion);
    setCurrentQuestion(updatedQuestion);
  };

  const handleAnswerChange = (selectedChoice: string) => {
    const updatedQuestion: Question = {
      ...currentQuestion,
      choices: currentQuestion.choices.map((choice) => ({
        ...choice,
        isSelected: choice.choice === selectedChoice,
      })),
      isAnswered: selectedChoice !== "",
    };

    setQuestions(
      questions.map((question) => {
        if (question.order === currentQuestion.order) {
          return updatedQuestion;
        }
        return question;
      }),
    );
    updateQuestion(currentQuestion.order, updatedQuestion);
    setCurrentQuestion(updatedQuestion);
  };

  const handleReviewLater = (reviewLater: boolean) => {
    const updatedQuestion: Question = {
      ...currentQuestion,
      reviewLater: reviewLater,
    };

    setQuestions(
      questions.map((question) => {
        if (question.order === currentQuestion.order) {
          return updatedQuestion;
        }
        return question;
      }),
    );
    updateQuestion(currentQuestion.order, updatedQuestion);
    setCurrentQuestion(updatedQuestion);
  };

  const handleMultipleAnswerChange = (choice: string, checked: boolean) => {
    const updatedChoices: QuestionChoice[] = currentQuestion.choices.map(
      (opt) => (opt.choice === choice ? { ...opt, isSelected: checked } : opt),
    );

    const updatedQuestion: Question = {
      ...currentQuestion,
      choices: updatedChoices,
      isAnswered: updatedChoices.some((opt) => opt.isSelected),
    };

    updateQuestion(currentQuestion.order, updatedQuestion);
    setCurrentQuestion(updatedQuestion);
  };

  const handleLeaveFeedback = (feedback: boolean) => {
    const updatedQuestion: Question = {
      ...currentQuestion,
      leaveFeedback: feedback,
    };

    setQuestions(
      questions.map((question) => {
        if (question.order === currentQuestion.order) {
          return updatedQuestion;
        }
        return question;
      }),
    );
    updateQuestion(currentQuestion.order, updatedQuestion);
    setCurrentQuestion(updatedQuestion);
  };

  const handleSubmit = () => {
    stopTimer();
    router.push("/review"); // Redirect to review page
  };

  useEffect(() => {
    startTimer();
  }, []);

  return (
    <SidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <AppSidebar
        questions={questions}
        handleChangeQuestion={handleChangeQuestion}
      />
      <main className="flex w-full flex-col justify-between p-2">
        <SidebarTrigger />
        <div className="flex w-full flex-row items-center justify-between p-4">
          <h2 className="font-bold">Question {currentQuestionOrder + 1}</h2>
          <div className="flex flex-col text-center">
            <div className="flex flex-row space-x-2">
              <p className="hidden md:block">Exam Question Progress</p>
              <p>
                ({getAnsweredQuestions().length}/{questions.length})
              </p>
            </div>
            <Progress value={getProgress()} />
          </div>
          <div className="flex flex-col text-center">
            <p className="hidden md:block">Time Remaining</p>
            <p>{formatTime(timer)}</p>
          </div>
        </div>

        <div className="m-4 flex h-full flex-col gap-y-4 rounded-lg border p-4">
          <p>{currentQuestion.question}</p>

          {currentQuestion.type === QuestionType.MultipleChoice && (
            <RadioGroup
              className="flex flex-col gap-y-4"
              value={
                currentQuestion.choices.find((option) => option.isSelected)
                  ?.choice || ""
              }
              onValueChange={handleAnswerChange}
            >
              {currentQuestion.choices.map((option, index) => (
                <div
                  key={`${currentQuestionOrder}-option-${index}`}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem
                    value={option.choice}
                    id={option.choice}
                    className="cursor-pointer"
                  />
                  <Label htmlFor={option.choice}>
                    {getAlphabetByOrder(index + 1)}. {option.choice}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQuestion.type === QuestionType.MultipleAnswer && (
            <div className="flex flex-col gap-y-4">
              {currentQuestion.choices.map((option, index) => (
                <div
                  key={`${currentQuestionOrder}-option-${index}`}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={option.choice}
                    checked={option.isSelected}
                    onCheckedChange={(checked: boolean) =>
                      handleMultipleAnswerChange(option.choice, checked)
                    }
                    className="cursor-pointer"
                  />
                  <Label htmlFor={option.choice}>
                    {getAlphabetByOrder(index + 1)}. {option.choice}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {/* Reset answer button */}
          <Button onClick={handleResetAnswer} className="flex w-fit flex-row">
            <RotateCcw />
            <h2>Reset Answer</h2>
          </Button>
          <div className="flex flex-row items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reviewLater"
                checked={currentQuestion.reviewLater}
                onCheckedChange={handleReviewLater}
              />
              <label
                htmlFor="reviewLater"
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Review Later
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reviewLater"
                checked={currentQuestion.leaveFeedback}
                onCheckedChange={handleLeaveFeedback}
              />
              <label
                htmlFor="reviewLater"
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Leave Feedback
              </label>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-y-4 p-4 md:flex-row">
          <div className="flex flex-row items-center space-x-2">
            <Button
              disabled={currentQuestionOrder === 0}
              onClick={() => handleChangeQuestion(currentQuestionOrder - 1)}
              className="flex cursor-pointer flex-row md:min-w-48"
            >
              <ArrowLeft />
              <h2 className="w-full">Previous</h2>
            </Button>
            <Button
              disabled={currentQuestionOrder === questions.length - 1}
              onClick={() => handleChangeQuestion(currentQuestionOrder + 1)}
              className="flex cursor-pointer flex-row md:min-w-48"
            >
              <h2 className="w-full">Next</h2>
              <ArrowRight />
            </Button>
          </div>
          {getAnsweredQuestions().length === questions.length && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary flex cursor-pointer flex-row md:min-w-48">
                  <BookOpenCheck />
                  <h2 className="w-full">Submit</h2>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This will submit your answers and you won&apos;t be able to
                    change them.
                  </DialogDescription>
                </DialogHeader>

                <Button
                  onClick={handleSubmit}
                  type="submit"
                  className="bg-primary"
                >
                  Submit
                </Button>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </main>

      <Dialog open={isOnBreak}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>You are on a break</DialogTitle>
            <DialogDescription>
              You can start the exam again by clicking the button below.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => {
              stopBreak();
            }}
            className="bg-primary"
          >
            Start Exam
          </Button>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
