import QuestionService from "@/lib/services/question-service";
import { QuestionCreateUpdate } from "@/lib/types/questions";
import { extractAxiosErrorMessage } from "@/lib/utils";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

const createQuestionRequest = async (data: QuestionCreateUpdate) => {
  try {
    const response = await QuestionService.create(data);
    if (response) {
      return response;
    }
    throw new Error("Failed to create question");
  } catch (error) {
    throw error;
  }
};

const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: createQuestion } = useMutation({
    mutationFn: (data: QuestionCreateUpdate) => createQuestionRequest(data),
    onSuccess: () => {
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: ["questions"] });
      });

      toast.success("Question created successfully");
    },
    onError: (error) => {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
      throw new Error(message);
    },
  });
  return { createQuestion, isPending };
};

export default useCreateQuestion;
