import ExamSessionService, {
  UpdateQuestionPointsArgs,
  UpdateQuestionPointsRequest,
} from "@/lib/services/exam-session-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

const updateQuestionPointsRequest = async ({
  examSessionId,
  questions,
}: UpdateQuestionPointsRequest) => {
  try {
    const response = await ExamSessionService.updateQuestionPoints({
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
    mutationFn: (questions: UpdateQuestionPointsArgs[]) =>
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
