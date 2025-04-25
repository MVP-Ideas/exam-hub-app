import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS } from "@/lib/constants/exam";

type Props = {
  value?: string | null;
  onChange: (value: string) => void;
  includeNull: boolean;
  disabled?: boolean;
};

export default function ExamStatusSelect({
  value,
  onChange,
  includeNull,
  disabled = false,
}: Props) {
  return (
    <Select
      disabled={disabled}
      onValueChange={onChange}
      value={value ?? "null"}
      defaultValue={"null"}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
        {includeNull && (
          <SelectItem value="null">
            <span className="text-muted-foreground">All Statuses</span>
          </SelectItem>
        )}
        {STATUS_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
