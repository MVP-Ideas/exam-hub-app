import ExamService from "@/lib/services/exam-service";
import { extractAxiosErrorMessage } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

const featureExamRequest = async (examId: string) => {
  try {
    const response = await ExamService.feature(examId);
    return response;
  } catch (error) {
    throw error;
  }
};

const useFeatureExam = (examId: string) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: featureExam } = useMutation({
    mutationFn: () => featureExamRequest(examId),
    onSuccess: () => {
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: ["exams"] });
        queryClient.invalidateQueries({ queryKey: ["exam", examId] });
      });

      toast.success("Exam featured successfully");
    },
    onError: (error) => {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
      throw new Error(message);
    },
  });

  return { featureExam, isPending };
};

export default useFeatureExam;
