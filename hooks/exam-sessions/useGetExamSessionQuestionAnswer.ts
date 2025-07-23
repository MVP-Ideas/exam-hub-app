import ExamSessionService from "@/lib/services/exam-session-service";
import { useMutation } from "@tanstack/react-query";

const useGetExamSessionQuestionCorrectAnswer = () => {
  const { mutateAsync: getCorrectAnswers, isPending } = useMutation({
    mutationFn: (params: {
      examSessionId: string;
      examSessionQuestionId: string;
    }) =>
      ExamSessionService.getAnswer(
        params.examSessionId,
        params.examSessionQuestionId,
      ),
  });

  return { getCorrectAnswers, isPending };
};

export default useGetExamSessionQuestionCorrectAnswer;
