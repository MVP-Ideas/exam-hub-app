"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronsUpDown } from "lucide-react";

import useQuestionCategories from "@/hooks/question-categories/useQuestionCategories";
import useCreateQuestionCategory from "@/hooks/question-categories/useCreateQuestionCategory";
import { cn } from "@/lib/utils"; // or replace with clsx if you're not using cn

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
  const { createQuestionCategory, isPending } = useCreateQuestionCategory();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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

  const handleAddCategory = async () => {
    if (name.trim().length < 1) return;

    const newCategory = await createQuestionCategory({
      name: name.trim(),
      description: description.trim(),
    });

    setName("");
    setDescription("");
    setIsDialogOpen(false);

    if (onChange) onChange(newCategory.name);
    if (onIdChange) onIdChange(newCategory.id);
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-muted-foreground w-full justify-center rounded-none"
                  type="button"
                >
                  + Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Question Category</DialogTitle>
                  <DialogDescription>
                    Create a new category for organizing your questions.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category-name">Name</Label>
                    <Input
                      id="category-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Azure Services"
                      maxLength={50}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category-description">Description</Label>
                    <Textarea
                      id="category-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe this category..."
                      maxLength={500}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleAddCategory}
                      disabled={isPending || name.trim().length < 1}
                    >
                      {isPending ? "Adding..." : "Add"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
