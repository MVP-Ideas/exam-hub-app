import QuestionCategoryService from "@/lib/services/question-category-service";
import { QuestionCategoryCreate } from "@/lib/types/question-categories";
import { extractAxiosErrorMessage } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

const createQuestionCategoryRequest = async (data: QuestionCategoryCreate) => {
  try {
    const response = await QuestionCategoryService.create(data);
    if (response) {
      return response;
    }
    throw new Error("Failed to create question category");
  } catch (error) {
    throw error;
  }
};

const useCreateQuestionCategory = () => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: createQuestionCategory } = useMutation({
    mutationFn: (data: QuestionCategoryCreate) =>
      createQuestionCategoryRequest(data),
    onSuccess: () => {
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: ["question-categories"] });
      });
      toast.success("Question category created successfully");
    },
    onError: (error) => {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
      throw new Error(message);
    },
  });
  return { createQuestionCategory, isPending };
};
export default useCreateQuestionCategory;
