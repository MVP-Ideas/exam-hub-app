import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuestionType } from "@/lib/types/questions";
import {
  Binary,
  CircleDotIcon,
  CopyCheckIcon,
  GripVertical,
} from "lucide-react";

const LABEL_MAP: Record<string, React.ReactNode> = {
  [QuestionType.MultipleChoiceSingle]: (
    <div className="flex flex-row items-center gap-2">
      <CircleDotIcon size={12} className="text-muted-foreground" />
      <span>Multiple Choice (Single)</span>
    </div>
  ),
  [QuestionType.TrueFalse]: (
    <div className="flex flex-row items-center gap-2">
      <Binary size={12} className="text-muted-foreground" />
      <span>True / False</span>
    </div>
  ),
  [QuestionType.MultipleChoiceMultiple]: (
    <div className="flex flex-row items-center gap-2">
      <CopyCheckIcon size={12} className="text-muted-foreground" />
      <span>Multiple Choice (Multiple)</span>
    </div>
  ),
  [QuestionType.DragAndDrop]: (
    <div className="flex flex-row items-center gap-2">
      <GripVertical size={12} className="text-muted-foreground" />
      <span>Drag and Drop</span>
    </div>
  ),
};

type Props = {
  value?: string | null;
  onChange: (value: string) => void;
  includeNull: boolean;
};

export default function QuestionTypeSelect({
  value,
  onChange,
  includeNull,
}: Props) {
  return (
    <Select
      value={value ?? "null"}
      onValueChange={(val) => {
        onChange(val === "null" ? "" : val);
      }}
    >
      <SelectTrigger className="w-full truncate">
        <SelectValue placeholder="Select Type" />
      </SelectTrigger>
      <SelectContent>
        {includeNull && (
          <SelectItem value="null">
            <span className="text-muted-foreground">No Filter</span>
          </SelectItem>
        )}
        {Object.entries(QuestionType).map(([key]) => (
          <SelectItem className="w-full truncate" key={key} value={key}>
            {LABEL_MAP[key as keyof typeof LABEL_MAP] ?? key}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
