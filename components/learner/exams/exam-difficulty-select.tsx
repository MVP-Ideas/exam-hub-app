"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DIFFICULTY_OPTIONS } from "@/lib/constants/exam";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

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
    if (value === null || value === undefined) {
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
      <SelectTrigger
        className={cn(
          "hover:text-muted-foreground flex h-10 w-full cursor-pointer flex-row justify-between border border-white/10 bg-white/10 text-left text-base text-white backdrop-blur-sm placeholder:text-white hover:bg-white focus-visible:ring-1 focus-visible:ring-white/20 [&_svg:not([class*='text-'])]:text-white/70",
        )}
      >
        <SelectValue className="w-full" placeholder="Select Difficulty" />
      </SelectTrigger>
      <SelectContent>
        {includeNull && (
          <SelectItem value="null">
            <span>Select difficulty</span>
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
