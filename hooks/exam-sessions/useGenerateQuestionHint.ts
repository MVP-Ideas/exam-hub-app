import { useMutation } from "@tanstack/react-query";
import ExamSessionService from "@/lib/services/exam-session-service";

const generateHintRequest = async (
  examSessionId: string,
  questionId: string,
) => {
  try {
    const response = await ExamSessionService.generateHint(
      examSessionId,
      questionId,
    );
    return response.hint;
  } catch (error) {
    throw error;
  }
};

const useGenerateQuestionHint = () => {
  const { mutateAsync: generateHint, isPending } = useMutation({
    mutationFn: (params: { examSessionId: string; questionId: string }) =>
      generateHintRequest(params.examSessionId, params.questionId),
    onError: (error) => {
      console.error("Error generating hint:", error);
    },
  });

  return { generateHint, isPending };
};

export default useGenerateQuestionHint;
