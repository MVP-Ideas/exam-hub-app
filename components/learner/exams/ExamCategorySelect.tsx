"use client";

import { useState } from "react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

import useExamCategories from "@/hooks/exam-categories/useExamCategories";

type Props = {
  value?: string | null;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

export default function ExamCategorySelect({
  value,
  onChange,
  disabled,
}: Props) {
  const { categories } = useExamCategories(true);
  const [open, setOpen] = useState(false);

  const selectedCategory = categories?.find((cat) => cat.name === value);

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "h-10 w-full justify-between border border-white/10 bg-white/10 text-left text-base text-white backdrop-blur-sm placeholder:text-white hover:bg-white focus-visible:ring-1 focus-visible:ring-white/20",
              !selectedCategory?.name && "text-white",
            )}
          >
            {selectedCategory?.name || "Select a category"}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-70" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] p-0"
        >
          <Command>
            <CommandInput
              placeholder="Search categories..."
              className="text-sm"
            />
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  onChange?.("");
                  setOpen(false);
                }}
              >
                <span className="text-muted-foreground">None</span>
              </CommandItem>
              {categories?.map((category) => (
                <CommandItem
                  key={category.id}
                  onSelect={() => {
                    onChange?.(category.name);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      category.name === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
