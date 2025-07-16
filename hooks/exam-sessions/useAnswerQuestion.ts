import ExamSessionService from "@/lib/services/exam-session-service";
import { CreateAnswerRequest } from "@/lib/types/answer";
import { ExamSessionQuestionResponse } from "@/lib/types/exam-session-question";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";

type AnswerQuestionParams = {
  examSessionId: string;
  questionId: string;
  answer: CreateAnswerRequest;
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
    onSuccess: (data: ExamSessionQuestionResponse, variables) => {
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
