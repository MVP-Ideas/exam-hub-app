import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DIFFICULTY_OPTIONS } from "@/lib/constants/exam";
import { AlignEndHorizontal } from "lucide-react";
import { useEffect } from "react";

type Props = {
  value?: string | null;
  onChange: (value: string) => void;
  includeNull: boolean;
  disabled?: boolean;
};

export default function ExamDifficultySelect({
  value,
  onChange,
  includeNull,
  disabled = false,
}: Props) {
  useEffect(() => {
    if (value === null) {
      onChange("null");
    } else if (value === undefined) {
      onChange("null");
    } else {
      onChange(value);
    }
  }, [value, onChange]);

  return (
    <Select
      disabled={disabled}
      onValueChange={onChange}
      value={value ?? "null"}
      defaultValue={value ?? "null"}
    >
      <SelectTrigger className="bg-background w-full justify-between">
        <div className="flex items-center gap-2">
          <AlignEndHorizontal className="text-muted-foreground h-4 w-4 shrink-0" />
          <SelectValue placeholder="Select Difficulty" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {includeNull && (
          <SelectItem value="null">
            <span className="text-muted-foreground">All Levels</span>
          </SelectItem>
        )}
        {DIFFICULTY_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
