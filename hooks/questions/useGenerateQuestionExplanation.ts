import { useMutation } from "@tanstack/react-query";
import QuestionService from "@/lib/services/question-service";
import { toast } from "sonner";
import { GenerateExplanationRequest } from "@/lib/types/functions-ai";

const generateExplanationRequest = async (data: GenerateExplanationRequest) => {
  try {
    const response = await QuestionService.generateExplanation(data);
    return response;
  } catch (error) {
    throw error;
  }
};

const useGenerateQuestionExplanation = () => {
  const { mutateAsync: generateExplanation, isPending } = useMutation({
    mutationFn: (data: GenerateExplanationRequest) =>
      generateExplanationRequest(data),
    onSuccess: () => {
      toast.success("Explanation generated successfully");
    },
    onError: () => {
      toast.error("Failed to generate explanation");
    },
  });

  return { generateExplanation, isPending };
};

export default useGenerateQuestionExplanation;
