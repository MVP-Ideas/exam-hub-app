import ExamSessionService from "@/lib/services/exam-session-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

const completeReviewRequest = async (examSessionId: string) => {
  try {
    const response = await ExamSessionService.completeReview(examSessionId);
    if (response) {
      return response;
    }
    throw new Error("Failed to complete review");
  } catch (error) {
    throw error;
  }
};

const useCompleteReview = (examSessionId: string) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: completeReview } = useMutation({
    mutationFn: () => completeReviewRequest(examSessionId),
    onSuccess: () => {
      startTransition(() => {
        // Invalidate the exam session result query to refetch with updated data
        queryClient.invalidateQueries({
          queryKey: ["examSessionResult", examSessionId],
        });

        // Also invalidate the exam sessions list if it exists
        queryClient.invalidateQueries({
          queryKey: ["examSessions"],
        });
      });
      toast.success("Review completed successfully");
    },
    onError: (error) => {
      toast.error("Failed to complete review");
      console.error("Error completing review:", error);
    },
  });

  return { completeReview, isPending };
};

export default useCompleteReview;
