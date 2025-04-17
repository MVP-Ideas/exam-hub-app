import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuestionType } from "@/lib/types/questions";

type Props = {
  onChange: (value: string | null) => void;
};

export default function QuestionCategorySelect({ onChange }: Props) {
  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="null" onClick={() => onChange(null)}>
          <span className="text-muted-foreground">Select Category</span>
        </SelectItem>
        {Object.values(QuestionType).map((type) => (
          <SelectItem key={type} value={type} onClick={() => onChange(type)}>
            {type}
          </SelectItem>
        ))}
        <SelectItem value="long" onClick={() => onChange(null)}>
          VERY LONG NAME OF CATEGORY
        </SelectItem>
        {/* Add category */}
        <Button variant="ghost" className="mt-2 w-full border-none">
          <span className="text-muted-foreground">Add Category</span>
        </Button>
      </SelectContent>
    </Select>
  );
}
