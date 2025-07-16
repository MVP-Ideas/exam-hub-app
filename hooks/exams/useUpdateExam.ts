import ExamService from "@/lib/services/exam-service";
import { CreateExamRequest } from "@/lib/types/exam";
import { extractAxiosErrorMessage } from "@/lib/utils";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

const updateExamRequest = async (id: string, data: CreateExamRequest) => {
  try {
    const response = await ExamService.update(id, data);
    if (response) {
      return response;
    }
    throw new Error("Failed to update exam");
  } catch (error) {
    throw error;
  }
};

const useUpdateExam = (id: string) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: updateExam } = useMutation({
    mutationFn: (data: CreateExamRequest) => updateExamRequest(id, data),
    onSuccess: () => {
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: ["exams"] });
        queryClient.invalidateQueries({ queryKey: ["exam", id] });
      });

      toast.success("Exam updated successfully");
    },
    onError: (error) => {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
      throw new Error(message);
    },
  });
  return { updateExam, isPending };
};
export default useUpdateExam;
