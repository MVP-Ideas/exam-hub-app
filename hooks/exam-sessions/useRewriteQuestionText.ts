import { useMutation } from "@tanstack/react-query";
import { RewriteDifficulty } from "../../lib/types";
import ExamSessionService from "../../lib/services/exam-session-service";
import { toast } from "sonner";

const rewriteQuestionRequest = async (
  examSessionId: string,
  questionId: string,
  difficulty: RewriteDifficulty,
) => {
  const response = await ExamSessionService.rewriteQuestion(
    examSessionId,
    questionId,
    difficulty,
  );

  return response;
};

export const useRewriteQuestionText = () => {
  const { mutateAsync: rewriteQuestion, isPending } = useMutation({
    mutationFn: (params: {
      examSessionId: string;
      questionId: string;
      difficulty: RewriteDifficulty;
    }) =>
      rewriteQuestionRequest(
        params.examSessionId,
        params.questionId,
        params.difficulty,
      ),
    onError: (error) => {
      console.error("Error rewriting question:", error);
      toast.error("Error rewriting question. Please try again.");
    },
  });

  return { rewriteQuestion, isPending };
};
