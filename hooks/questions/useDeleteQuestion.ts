import QuestionService from "@/lib/services/question-service";
import { extractAxiosErrorMessage } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

const deleteQuestionRequest = async (questionId: string) => {
  try {
    const response = await QuestionService.delete(questionId);
    if (response) {
      return response;
    }
    throw new Error("Failed to delete question");
  } catch (error) {
    throw error;
  }
};

const useDeleteQuestion = (id: string) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: deleteQuestion } = useMutation({
    mutationFn: () => deleteQuestionRequest(id),
    onSuccess: () => {
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: ["questions"] });
      });
      toast.success("Question deleted successfully");
    },
    onError: (error) => {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
      throw new Error(message);
    },
  });
  return { deleteQuestion, isPending };
};

export default useDeleteQuestion;
