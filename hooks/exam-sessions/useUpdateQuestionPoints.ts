import ExamSessionService from "@/lib/services/exam-session-service";
import { UpdateExamSessionQuestionRequest } from "@/lib/types/exam-session-question";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

type UpdateQuestionPointsArgs = {
  examSessionId: string;
  questions: UpdateExamSessionQuestionRequest[];
};

const updateQuestionPointsRequest = async ({
  examSessionId,
  questions,
}: UpdateQuestionPointsArgs) => {
  try {
    const response = await ExamSessionService.update({
      examSessionId: examSessionId,
      questions: questions,
    });
    if (response) {
      return response;
    }
    throw new Error("Failed to update question points");
  } catch (error) {
    throw error;
  }
};

const useUpdateQuestionPoints = (examSessionId: string) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: updateQuestionPoints } = useMutation({
    mutationFn: (questions: UpdateExamSessionQuestionRequest[]) =>
      updateQuestionPointsRequest({
        examSessionId,
        questions: questions,
      }),
    onSuccess: () => {
      startTransition(() => {
        queryClient.invalidateQueries({
          queryKey: ["examSessionResult", examSessionId],
        });
      });
      toast.success("Question points updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update question points");
      console.error("Error updating question points:", error);
    },
  });

  return { updateQuestionPoints, isPending };
};

export default useUpdateQuestionPoints;
