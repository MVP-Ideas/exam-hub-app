import ExamSessionService from "@/lib/services/exam-session";
import { ExamSession } from "@/lib/types/exam-session";
import { extractAxiosErrorMessage } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

const startExamSessionRequest = async (examId: string) => {
  try {
    const response = await ExamSessionService.startExamSession(examId);
    if (response) {
      return response;
    }
    throw new Error("Failed to start exam session");
  } catch (error) {
    throw error;
  }
};

const useStartExamSession = () => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: startExamSession } = useMutation({
    mutationFn: (examId: string) => startExamSessionRequest(examId),
    onSuccess: (data: ExamSession) => {
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: ["examSession", data.id] });
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
