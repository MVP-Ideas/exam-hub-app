import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuestionType } from "@/lib/types/questions";
import { getQuestionTypeBadge } from "@/lib/constants/question";

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
        <SelectValue placeholder="All Types" />
      </SelectTrigger>
      <SelectContent>
        {includeNull && (
          <SelectItem value="null">
            <span className="text-muted-foreground">All Types</span>
          </SelectItem>
        )}
        {Object.entries(QuestionType).map(([key, value]) => (
          <SelectItem className="w-full truncate" key={key} value={value}>
            {getQuestionTypeBadge(value)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
