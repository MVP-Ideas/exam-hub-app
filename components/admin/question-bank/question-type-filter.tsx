import { useState } from "react";
import { QuestionType } from "@/lib/types/questions";
import { getFormattedQuestionType } from "@/lib/constants/question";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  selectedTypes: string[];
  onChange: (types: string[]) => void;
};

export default function QuestionTypeFilter({
  selectedTypes = [],
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleTypeToggle = (type: string) => {
    const newSelectedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];

    onChange(newSelectedTypes);
  };

  const handleSelectAll = () => {
    onChange(Object.values(QuestionType));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const questionTypes = Object.values(QuestionType);
  const filteredTypes = searchQuery
    ? questionTypes.filter((type) =>
        getFormattedQuestionType(type as QuestionType)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      )
    : questionTypes;

  const selectedCount = selectedTypes.length;
  const allSelected = selectedCount === questionTypes.length;
  const noneSelected = selectedCount === 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex w-full justify-between">
          <div className="text-muted-foreground flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            <span className="text-sm">
              {selectedCount ? `${selectedCount} types` : "All Types"}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-3">
        <div>
          <Input
            placeholder="Search types..."
            className="mb-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="mb-2 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              disabled={allSelected}
              className="h-7 text-xs"
            >
              Select All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              disabled={noneSelected}
              className="h-7 text-xs"
            >
              Clear All
            </Button>
          </div>
          <div className="h-fit">
            <div className="space-y-4">
              {filteredTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() => handleTypeToggle(type)}
                    className="h-4 w-4"
                  />
                  <Label
                    htmlFor={`type-${type}`}
                    className="cursor-pointer text-sm leading-none"
                  >
                    {getFormattedQuestionType(type as QuestionType)}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
