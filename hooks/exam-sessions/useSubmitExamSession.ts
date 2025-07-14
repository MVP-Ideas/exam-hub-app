import ExamSessionService from "@/lib/services/exam-session-service";
import { extractAxiosErrorMessage } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

const submitExamSessionRequest = async (examSessionId: string) => {
  try {
    const response = await ExamSessionService.submit(examSessionId);
    if (response) {
      return response;
    }
    throw new Error("Failed to submit exam session");
  } catch (error) {
    throw error;
  }
};

const useSubmitExamSession = (examSessionId: string) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: submitExamSession } = useMutation({
    mutationFn: () => submitExamSessionRequest(examSessionId),
    onSuccess: () => {
      startTransition(() => {
        queryClient.invalidateQueries({
          queryKey: ["examSession", examSessionId],
        });
        queryClient.invalidateQueries({ queryKey: ["examSessions"] });
        queryClient.invalidateQueries({ queryKey: ["exams"] });
      });
    },
    onError: (error) => {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
      throw new Error(message);
    },
  });

  return { submitExamSession, isPending };
};

export default useSubmitExamSession;
