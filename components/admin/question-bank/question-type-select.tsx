import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuestionType } from "@/lib/types/questions";

type Props = {
  value?: keyof typeof QuestionType | null;
  onChange: (value: keyof typeof QuestionType | null) => void;
};

export default function QuestionTypeSelect({ value, onChange }: Props) {
  return (
    <Select
      value={value ?? "null"}
      onValueChange={(val) => {
        onChange(val === "null" ? null : (val as keyof typeof QuestionType));
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="null">
          <span className="text-muted-foreground">Select Type</span>
        </SelectItem>
        {Object.entries(QuestionType).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
