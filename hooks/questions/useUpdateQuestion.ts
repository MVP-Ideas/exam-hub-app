import QuestionService from "@/lib/services/question-service";
import { QuestionCreateUpdate } from "@/lib/types/questions";
import { extractAxiosErrorMessage } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

const updateQuestionRequest = async (
  id: string,
  data: QuestionCreateUpdate,
) => {
  try {
    const response = await QuestionService.update(id, data);
    if (response) {
      return response;
    }
    throw new Error("Failed to update question");
  } catch (error) {
    throw error;
  }
};

const useUpdateQuestion = (id: string) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: updateQuestion } = useMutation({
    mutationFn: (data: QuestionCreateUpdate) => updateQuestionRequest(id, data),
    onSuccess: () => {
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: ["questions"] });
        queryClient.invalidateQueries({ queryKey: ["question", id] });
      });

      toast.success("Question updated successfully");
    },
    onError: (error) => {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
      throw new Error(message);
    },
  });
  return { updateQuestion, isPending };
};
export default useUpdateQuestion;
