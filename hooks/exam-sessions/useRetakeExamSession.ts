import ExamSessionService from "@/lib/services/exam-session-service";
import { RetakeOptions } from "@/lib/types/exam-session";
import { extractAxiosErrorMessage } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

const retakeExamSessionRequest = async (
  examSessionId: string,
  retakeOption: RetakeOptions,
) => {
  try {
    const response = await ExamSessionService.retakeExam(
      examSessionId,
      retakeOption,
    );
    if (response) {
      return response;
    }
    throw new Error("Failed to retake exam session");
  } catch (error) {
    throw error;
  }
};

const useRetakeExamSession = (examSessionId: string) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: retakeExamSession } = useMutation({
    mutationFn: (retakeOption: RetakeOptions) =>
      retakeExamSessionRequest(examSessionId, retakeOption),
    onSuccess: () => {
      startTransition(() => {
        // Invalidate exam session queries
        queryClient.invalidateQueries({
          queryKey: ["examSession", examSessionId],
        });
        queryClient.invalidateQueries({
          queryKey: ["examSessions"],
        });
        // Invalidate exam session result
        queryClient.invalidateQueries({
          queryKey: ["examSessionResult", examSessionId],
        });
        // Invalidate practice options
        queryClient.invalidateQueries({
          queryKey: ["examSessionPracticeOptions", examSessionId],
        });
      });
    },
    onError: (error) => {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
      console.error("Error retaking exam session:", error);
    },
  });

  return { retakeExamSession, isPending };
};

export default useRetakeExamSession;
