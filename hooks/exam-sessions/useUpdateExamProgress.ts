import ExamSessionService, {
  UpdateExamProgressRequest,
} from "@/lib/services/exam-session";
import { extractAxiosErrorMessage } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";

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
  const { mutateAsync: updateProgress, isPending } = useMutation({
    mutationFn: (request: UpdateExamProgressRequest) =>
      updateProgressRequest(examSessionId, request),

    onError: (error) => {
      const message = extractAxiosErrorMessage(error);
      console.error("Failed to update exam progress:", message);
    },
  });

  return { updateProgress, isPending };
};

export default useUpdateExamProgress;
