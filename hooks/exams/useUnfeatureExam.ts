import ExamService from "@/lib/services/exam-service";
import { extractAxiosErrorMessage } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

const unfeatureExamRequest = async (examId: string) => {
  try {
    const response = await ExamService.unfeature(examId);
    return response;
  } catch (error) {
    throw error;
  }
};

const useUnfeatureExam = (examId: string) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: unfeatureExam } = useMutation({
    mutationFn: () => unfeatureExamRequest(examId),
    onSuccess: () => {
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: ["exams"] });
        queryClient.invalidateQueries({ queryKey: ["exam", examId] });
      });

      toast.success("Exam unfeatured successfully");
    },
    onError: (error) => {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
      throw new Error(message);
    },
  });

  return { unfeatureExam, isPending };
};

export default useUnfeatureExam;
