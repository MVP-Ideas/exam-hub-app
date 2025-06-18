import ExamSessionService from "@/lib/services/exam-session-service";
import {
  ExamSessionAnswerCreate,
  ExamSessionQuestion,
} from "@/lib/types/exam-session";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";

type AnswerQuestionParams = {
  examSessionId: string;
  questionId: string;
  answer: ExamSessionAnswerCreate;
};

const answerQuestionRequest = async ({
  examSessionId,
  questionId,
  answer,
}: AnswerQuestionParams) => {
  try {
    if (answer.timeSpentSeconds == 0) {
      answer.timeSpentSeconds = 1;
    }
    const response = await ExamSessionService.answerQuestion(
      examSessionId,
      questionId,
      answer,
    );
    if (response) {
      return response;
    }
    throw new Error("Failed to submit answer");
  } catch (error) {
    throw error;
  }
};

const useAnswerQuestion = () => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: answerQuestion } = useMutation({
    mutationFn: (params: AnswerQuestionParams) => answerQuestionRequest(params),
    onSuccess: (data: ExamSessionQuestion, variables) => {
      startTransition(() => {
        queryClient.invalidateQueries({
          queryKey: [
            "examSessionQuestion",
            variables.examSessionId,
            variables.questionId,
          ],
        });
        queryClient.invalidateQueries({
          queryKey: ["examSession", variables.examSessionId],
        });
      });
    },
  });

  return { answerQuestion, isPending };
};

export default useAnswerQuestion;
