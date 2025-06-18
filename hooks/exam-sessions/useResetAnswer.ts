import ExamSessionService from "@/lib/services/exam-session-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

const resetAnswerRequest = async (
  examSessionId: string,
  questionId: string,
) => {
  try {
    const response = await ExamSessionService.resetAnswers(
      examSessionId,
      questionId,
    );
    if (response) {
      return response;
    }
    throw new Error("Failed to reset answer");
  } catch (error) {
    throw error;
  }
};

const useResetAnswer = (examSessionId: string, questionId: string) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: resetAnswer } = useMutation({
    mutationFn: () => resetAnswerRequest(examSessionId, questionId),
    onSuccess: () => {
      startTransition(() => {
        // Invalidate the specific question
        queryClient.invalidateQueries({
          queryKey: ["examSessionQuestion", examSessionId, questionId],
        });

        queryClient.invalidateQueries({
          queryKey: ["examSession", examSessionId],
        });
      });

      toast.success("Answer reset successfully");
    },
  });

  return { resetAnswer, isPending };
};

export default useResetAnswer;
