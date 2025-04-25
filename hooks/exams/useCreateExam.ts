import ExamService from "@/lib/services/exam-service";
import { ExamCreateUpdate } from "@/lib/types/exam";
import { extractAxiosErrorMessage } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

const createExamRequest = async (data: ExamCreateUpdate) => {
  try {
    const response = await ExamService.create(data);
    if (response) {
      return response;
    }
    throw new Error("Failed to create exam");
  } catch (error) {
    throw error;
  }
};

const useCreateExam = () => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: createExam } = useMutation({
    mutationFn: (data: ExamCreateUpdate) => createExamRequest(data),
    onSuccess: () => {
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: ["exams"] });
      });

      toast.success("Question created successfully");
    },
    onError: (error) => {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
      throw new Error(message);
    },
  });
  return { createExam, isPending };
};

export default useCreateExam;
