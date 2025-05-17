import ExamSessionService from "@/lib/services/exam-session";
import { ExamSession } from "@/lib/types/exam-session";
import { extractAxiosErrorMessage } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";

type UpdateProgressParams = {
  examSessionId: string;
  timeSpentSeconds: number;
};

const updateProgressRequest = async ({
  examSessionId,
  timeSpentSeconds,
}: UpdateProgressParams) => {
  try {
    const response = await ExamSessionService.updateProgress(
      examSessionId,
      timeSpentSeconds,
    );
    if (response) {
      return response;
    }
    throw new Error("Failed to update exam progress");
  } catch (error) {
    throw error;
  }
};

const useUpdateExamProgress = () => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: updateProgress } = useMutation({
    mutationFn: (params: UpdateProgressParams) => updateProgressRequest(params),
    onSuccess: (data: ExamSession, variables) => {
      startTransition(() => {
        queryClient.invalidateQueries({
          queryKey: ["examSession", variables.examSessionId],
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
