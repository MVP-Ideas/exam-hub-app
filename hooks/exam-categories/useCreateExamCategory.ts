import ExamCategoryService from "@/lib/services/exam-category-service";
import { CreateExamCategoryRequest } from "@/lib/types/exam-category";
import { extractAxiosErrorMessage } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

const createExamCategoryRequest = async (data: CreateExamCategoryRequest) => {
  try {
    const response = await ExamCategoryService.create(data);
    if (response) {
      return response;
    }
    throw new Error("Failed to create question category");
  } catch (error) {
    throw error;
  }
};

const useCreateExamCategory = () => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: createExamCategory } = useMutation({
    mutationFn: (data: CreateExamCategoryRequest) =>
      createExamCategoryRequest(data),
    onSuccess: () => {
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: ["exam-categories"] });
      });
      toast.success("Exam category created successfully");
    },
    onError: (error) => {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
      throw new Error(message);
    },
  });
  return { createExamCategory, isPending };
};
export default useCreateExamCategory;
