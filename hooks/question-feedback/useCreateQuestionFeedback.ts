import QuestionFeedbackService from "@/lib/services/question-feedback-service";
import { QuestionFeedbackCreate } from "@/lib/types/question-feedback";
import { extractAxiosErrorMessage } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

const createQuestionFeedbackRequest = async (data: QuestionFeedbackCreate) => {
  try {
    const response = await QuestionFeedbackService.create(data);
    if (response) {
      return response;
    }
    throw new Error("Failed to submit question feedback");
  } catch (error) {
    throw error;
  }
};

const useCreateQuestionFeedback = () => {
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: createQuestionFeedback } = useMutation({
    mutationFn: (data: QuestionFeedbackCreate) =>
      createQuestionFeedbackRequest(data),
    onSuccess: () => {
      startTransition(() => {
        // No need to invalidate queries as feedback likely won't be displayed immediately
      });
      toast.success("Feedback submitted successfully");
    },
    onError: (error) => {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
      throw new Error(message);
    },
  });

  return { createQuestionFeedback, isPending };
};

export default useCreateQuestionFeedback;
