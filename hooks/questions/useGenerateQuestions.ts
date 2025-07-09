import QuestionService from "@/lib/services/question-service";
import { GenerateQuestionsRequest } from "@/lib/types/questions";
import { extractAxiosErrorMessage } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const generateQuestionsRequest = async (data: GenerateQuestionsRequest) => {
  try {
    const response = await QuestionService.generateQuestions(data);
    if (response) {
      return response;
    }
    throw new Error("Failed to generate questions");
  } catch (error) {
    throw error;
  }
};

const useGenerateQuestions = () => {
  const { mutateAsync: generateQuestions, isPending } = useMutation({
    mutationFn: (data: GenerateQuestionsRequest) =>
      generateQuestionsRequest(data),
    onError: (error) => {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
    },
  });

  return {
    generateQuestions,
    isPending,
  };
};

export default useGenerateQuestions;
