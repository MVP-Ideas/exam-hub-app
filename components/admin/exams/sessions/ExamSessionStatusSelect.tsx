import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SESSION_STATUS_OPTIONS } from "@/lib/constants/exam-session";
import { ClockIcon } from "lucide-react";

type Props = {
  value?: string | null;
  onChange: (value: string) => void;
  includeNull: boolean;
  disabled?: boolean;
};

export default function ExamSessionStatusSelect({
  value,
  onChange,
  includeNull,
  disabled = false,
}: Props) {
  return (
    <Select
      disabled={disabled}
      onValueChange={(v) => onChange(v === "null" ? "" : v)}
      value={value || "null"}
      defaultValue={value || "null"}
    >
      <SelectTrigger className="bg-background w-full justify-between">
        <div className="flex items-center gap-2">
          <ClockIcon className="h-4 w-4 shrink-0" />
          <SelectValue placeholder="Select Status" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {includeNull && (
          <SelectItem value="null">
            <span className="text-muted-foreground">All Statuses</span>
          </SelectItem>
        )}
        {SESSION_STATUS_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
