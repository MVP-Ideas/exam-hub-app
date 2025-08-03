import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText } from "lucide-react";
import { useEffect } from "react";
import useExamsList from "@/hooks/exams/useExamsList";

type Props = {
  value?: string | null;
  onChange: (value: string) => void;
  includeNull: boolean;
  disabled?: boolean;
};

export default function ExamListSelect({
  value,
  onChange,
  includeNull,
  disabled = false,
}: Props) {
  const { exams, isLoading } = useExamsList();

  useEffect(() => {
    if (value === null || value === undefined) {
      onChange("");
    } else {
      onChange(value);
    }
  }, [value, onChange]);

  return (
    <Select
      disabled={disabled || isLoading}
      onValueChange={(v) => onChange(v === "null" ? "" : v)}
      value={value || "null"}
      defaultValue={value || "null"}
    >
      <SelectTrigger className="bg-background w-full justify-between">
        <div className="flex items-center gap-2">
          <FileText className="text-muted-foreground h-4 w-4 shrink-0" />
          <SelectValue placeholder="Select Exam" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {includeNull && (
          <SelectItem value="null">
            <span className="text-muted-foreground">All Exams</span>
          </SelectItem>
        )}
        {exams.map((exam) => (
          <SelectItem key={exam.id} value={exam.id}>
            {exam.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
