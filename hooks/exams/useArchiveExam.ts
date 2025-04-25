import ExamService from "@/lib/services/exam-service";
import { extractAxiosErrorMessage } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

const archiveExamRequest = async (examId: string) => {
  try {
    const response = await ExamService.archive(examId);
    if (response) {
      return response;
    }
    throw new Error("Failed to archive exam");
  } catch (error) {
    throw error;
  }
};
const useArchiveExam = (id: string) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: archiveExam } = useMutation({
    mutationFn: () => archiveExamRequest(id),
    onSuccess: () => {
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: ["exams"] });
        queryClient.invalidateQueries({ queryKey: ["exam", id] });
      });

      toast.success("Exam archived successfully");
    },
    onError: (error) => {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
      throw new Error(message);
    },
  });
  return { archiveExam, isPending };
};
export default useArchiveExam;
