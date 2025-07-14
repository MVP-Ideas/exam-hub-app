import ExamSessionService from "@/lib/services/exam-session-service";
import { extractAxiosErrorMessage } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

const startExamSessionRequest = async (examId: string) => {
  try {
    const response = await ExamSessionService.start(examId);
    if (response) {
      return response;
    }
    throw new Error("Failed to start exam session");
  } catch (error) {
    throw error;
  }
};

const useStartExamSession = (examId: string) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: startExamSession } = useMutation({
    mutationFn: () => startExamSessionRequest(examId),
    onSuccess: () => {
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: ["examSession"] });
        queryClient.invalidateQueries({ queryKey: ["exam"] });
      });
      toast.success("Exam session started successfully");
    },
    onError: (error) => {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
      throw new Error(message);
    },
  });

  return { startExamSession, isPending };
};

export default useStartExamSession;
