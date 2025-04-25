import {
  CircleDotIcon,
  Binary,
  CopyCheckIcon,
  GripVertical,
} from "lucide-react";
import { QuestionType } from "../types/questions";

const typeColorMap: Record<QuestionType, string> = {
  [QuestionType.MultipleChoiceSingle]:
    "bg-blue-100 text-blue-800 border-blue-200",
  [QuestionType.MultipleChoiceMultiple]:
    "bg-purple-100 text-purple-800 border-purple-200",
  [QuestionType.TrueFalse]: "bg-yellow-100 text-yellow-800 border-yellow-200",
  [QuestionType.DragAndDrop]: "bg-green-100 text-green-800 border-green-200",
};

export const getQuestionTypeBadge = (type: QuestionType) => {
  const commonClass = `w-fit flex flex-row items-center justify-start gap-2 rounded-full border px-2 py-0.5 text-xs font-medium break-words ${typeColorMap[type]}`;

  switch (type) {
    case QuestionType.MultipleChoiceSingle:
      return (
        <span className={commonClass}>
          <CircleDotIcon size={14} className="shrink-0" />
          <p className="text-center text-wrap">Multiple Choice (Single)</p>
        </span>
      );
    case QuestionType.MultipleChoiceMultiple:
      return (
        <span className={commonClass}>
          <CopyCheckIcon size={14} className="shrink-0" />
          <p className="text-center text-wrap">Multiple Choice (Multiple)</p>
        </span>
      );
    case QuestionType.TrueFalse:
      return (
        <span className={commonClass}>
          <Binary size={14} className="shrink-0" />
          True / False
        </span>
      );
    case QuestionType.DragAndDrop:
      return (
        <span className={commonClass}>
          <GripVertical size={14} className="shrink-0" />
          Drag and Drop
        </span>
      );
    default:
      return null;
  }
};
