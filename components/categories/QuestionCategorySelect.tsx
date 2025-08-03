"use client";

import { useEffect, useState } from "react";

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
import { Separator } from "@/components/ui/separator";
import { Check, ChevronsUpDown } from "lucide-react";

import useQuestionCategories from "@/hooks/question-categories/useQuestionCategories";
import { cn } from "@/lib/utils";
import QuestionCategoryAddDialog from "../admin/question-categories/QuestionCategoryAddDialog";
import { QuestionCategory } from "@/lib/types/question-categories";

type Props = {
  value?: string | null;
  onChange?: (value: string) => void;
  onIdChange?: (id: string) => void;
  includeNull: boolean;
};

export default function QuestionCategorySelect({
  value,
  onChange,
  onIdChange,
  includeNull,
}: Props) {
  const { categories } = useQuestionCategories();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const selectedCategory = categories?.find((cat) =>
    onIdChange ? cat.id === value : cat.name === value,
  );

  useEffect(() => {
    if (value && onIdChange) {
      const found = categories?.find((c) => c.name === value);
      if (found) {
        onIdChange(found.id);
      }
    }
  }, [value, categories, onIdChange]);

  const handleAddCategory = (category: QuestionCategory) => {
    setIsDialogOpen(false);

    if (onChange) onChange(category.name);
    if (onIdChange) onIdChange(category.id);
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
            type="button"
          >
            {selectedCategory?.name ? (
              <span>{selectedCategory.name}</span>
            ) : (
              <span className="text-muted-foreground">
                {onIdChange ? "No category" : "Select a category"}
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] p-0"
        >
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {includeNull && (
                <CommandItem
                  onSelect={() => {
                    if (onChange) onChange("");
                    if (onIdChange) onIdChange("");
                    setOpen(false);
                  }}
                >
                  <span className="text-muted-foreground">
                    {onIdChange ? "No category" : "All categories"}
                  </span>
                </CommandItem>
              )}

              {categories?.map((category) => (
                <CommandItem
                  key={category.id}
                  onSelect={() => {
                    const idOrName = onIdChange ? category.id : category.name;
                    if (onChange) onChange(idOrName);
                    if (onIdChange) onIdChange(category.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      (
                        onIdChange
                          ? category.id === value
                          : category.name === value
                      )
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>

            <Separator />
            <QuestionCategoryAddDialog
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              onAddCategory={handleAddCategory}
            />
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
