"use client";

import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuestionStore } from "@/lib/stores/question-store";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { QuestionType } from "@/lib/types/questions";
import { Label } from "@/components/ui/label";

export default function Page() {
  const router = useRouter();
  const { questions, resetQuestions } = useQuestionStore();

  const handleReset = () => {
    resetQuestions();
    router.push("/");
  };

  return <div>Review</div>;

  // const totalScore = questions.reduce((score, question) => {
  // 	if (question.type === QuestionType.MultipleChoiceMultiple) {
  // 		const hasWrongAnswer = question.choices.some(
  // 			(choice) => choice.isSelected && !choice.isCorrect
  // 		);
  // 		const hasMissedAnswer = question.choices.some(
  // 			(choice) => choice.isCorrect && !choice.isSelected
  // 		);

  // 		return hasWrongAnswer || hasMissedAnswer ? score : score + 1;
  // 	}
  // 	const isCorrect = question.choices.every(
  // 		(choice) => choice.isCorrect === choice.isSelected
  // 	);
  // 	return isCorrect ? score + 1 : score;
  // }, 0);

  // const totalScorePercentage = (totalScore / questions.length) * 100;

  // return (
  // 	<div className="mx-auto max-w-3xl space-y-6 p-8">
  // 		<h1 className="text-2xl font-bold">Review Answers</h1>
  // 		{questions.map((question) => (
  // 			<Card key={question.order}>
  // 				<CardHeader>
  // 					<CardTitle>
  // 						{question.order}. {question.question}
  // 					</CardTitle>
  // 				</CardHeader>
  // 				<CardContent>
  // 					{question.choices.map((choice) => {
  // 						const isCorrect = choice.isCorrect;
  // 						const isSelected = choice.isSelected;
  // 						return (
  // 							<div key={choice.order} className="flex items-center gap-x-2">
  // 								{question.type === QuestionType.MultipleChoice && (
  // 									<RadioGroup className="flex flex-row items-center gap-x-2">
  // 										<RadioGroupItem
  // 											key={choice.order}
  // 											value={choice.choice}
  // 											checked={isSelected}
  // 											disabled
  // 										/>
  // 										<Label className={isSelected ? 'font-bold' : ''}>
  // 											{choice.choice}
  // 										</Label>
  // 									</RadioGroup>
  // 								)}
  // 								{question.type === QuestionType.MultipleAnswer && (
  // 									<div className="flex flex-row items-center gap-x-2">
  // 										<Checkbox checked={isSelected} disabled />

  // 										<Label className={isSelected ? 'font-bold' : ''}>
  // 											{choice.choice}
  // 										</Label>
  // 									</div>
  // 								)}
  // 								{isCorrect && isSelected && (
  // 									<Check className="text-green-500" />
  // 								)}
  // 								{!isCorrect && isSelected && <X className="text-red-500" />}
  // 								{isCorrect && !isSelected && (
  // 									<Check className="text-green-500" />
  // 								)}
  // 							</div>
  // 						);
  // 					})}
  // 				</CardContent>
  // 			</Card>
  // 		))}
  // 		<div className="text-xl font-bold">
  // 			Total Score: {totalScore} / {questions.length}{' '}
  // 			<span
  // 				className={`${
  // 					totalScorePercentage >= 70 ? 'text-green-500' : 'text-red-500'
  // 				}`}
  // 			>
  // 				({totalScorePercentage}%)
  // 			</span>
  // 		</div>
  // 		<div className="text-lg">
  // 			{totalScorePercentage >= 70 ? 'You passed!' : 'You failed!'}
  // 		</div>
  // 		<Button className="cursor-pointer" onClick={handleReset}>
  // 			Reset Quiz
  // 		</Button>
  // 	</div>
  // );
}
