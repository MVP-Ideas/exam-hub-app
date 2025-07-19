"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useExamCategories from "@/hooks/exam-categories/useExamCategories";

type Props = {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
  showOnlyActive?: boolean;
};

export default function ExamCategoryFilter({
  selectedCategories = [],
  onChange,
  showOnlyActive = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { categories, isLoading } = useExamCategories(showOnlyActive);

  const handleCategoryToggle = (categoryName: string) => {
    const newSelectedCategories = selectedCategories.includes(categoryName)
      ? selectedCategories.filter((id) => id !== categoryName)
      : [...selectedCategories, categoryName];

    onChange(newSelectedCategories);
  };

  const handleSelectAll = () => {
    if (!categories) return;
    onChange(categories.map((category) => category.id));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const filteredCategories =
    searchQuery && categories
      ? categories.filter((category) =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : categories || [];

  const selectedCount = selectedCategories.length;
  const allSelected = categories ? selectedCount === categories.length : false;
  const noneSelected = selectedCount === 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="bg-background flex w-full justify-between"
        >
          <div className="text-muted-foreground flex items-center">
            <Tag className="mr-2 h-4 w-4" />
            <span className="text-sm">
              {selectedCount ? `${selectedCount} categories` : "All Categories"}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-3">
        <div>
          <Input
            placeholder="Search categories..."
            className="mb-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="mb-2 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              disabled={allSelected || isLoading}
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
          <div className="h-fit max-h-[250px] overflow-y-auto">
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-muted-foreground text-sm">
                  Loading categories...
                </div>
              ) : (
                filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`exam-category-${category.id}`}
                      checked={selectedCategories.includes(category.name)}
                      onCheckedChange={() =>
                        handleCategoryToggle(category.name)
                      }
                      className="h-4 w-4"
                    />
                    <Label
                      htmlFor={`exam-category-${category.id}`}
                      className="cursor-pointer text-sm leading-none"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
