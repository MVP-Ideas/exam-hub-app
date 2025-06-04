import ExamSessionService, {
  UpdateExamProgressRequest,
} from "@/lib/services/exam-session";
import { extractAxiosErrorMessage } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";

const updateProgressRequest = async (
  examSessionId: string,
  request: UpdateExamProgressRequest,
) => {
  try {
    const response = await ExamSessionService.updateProgress(
      examSessionId,
      request,
    );
    if (response) {
      return response;
    }
    throw new Error("Failed to update exam progress");
  } catch (error) {
    throw error;
  }
};

const useUpdateExamProgress = (examSessionId: string) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: updateProgress } = useMutation({
    mutationFn: (request: UpdateExamProgressRequest) =>
      updateProgressRequest(examSessionId, request),
    onSuccess: () => {
      startTransition(() => {
        queryClient.invalidateQueries({
          queryKey: ["examSession", examSessionId],
        });
      });
    },
    onError: (error) => {
      const message = extractAxiosErrorMessage(error);
      console.error("Failed to update exam progress:", message);
    },
  });

  return { updateProgress, isPending };
};

export default useUpdateExamProgress;
