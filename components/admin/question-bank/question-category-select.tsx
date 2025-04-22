"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useQuestionCategories from "@/hooks/question-categories/useQuestionCategories";
import { Label } from "@/components/ui/label";
import useCreateQuestionCategory from "@/hooks/question-categories/useCreateQuestionCategory";

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
  const { categories, isLoading } = useQuestionCategories();
  const { createQuestionCategory, isPending } = useCreateQuestionCategory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleAddCategory = async () => {
    if (name.trim().length < 1) return;

    try {
      const newCategory = await createQuestionCategory({
        name: name.trim(),
        description: description.trim(),
      });

      setIsDialogOpen(false);
      setName("");
      setDescription("");

      if (onIdChange) onIdChange(newCategory.id);

      if (onChange) onChange(newCategory.name);
    } catch {
      console.log("Error creating category");
    }
  };

  useEffect(() => {
    if (value && onIdChange) {
      const selectedCategory = categories?.find(
        (category) => category.name === value,
      );
      if (selectedCategory) {
        onIdChange(selectedCategory.id);
      }
    }
  }, [value, categories, onIdChange]);

  return (
    <>
      <Select
        value={value ?? "null"}
        onValueChange={(val) => {
          if (onChange) onChange(val === "null" ? "" : val);
          if (onIdChange) {
            onIdChange(val === "null" ? "" : val);
          }
        }}
      >
        <SelectTrigger className="w-full truncate">
          <SelectValue
            className="w-full truncate"
            placeholder="Select Category"
          />
        </SelectTrigger>
        <SelectContent>
          {includeNull && (
            <SelectItem value="null">
              <span className="text-muted-foreground">None</span>
            </SelectItem>
          )}

          {isLoading && <SelectItem value="null">Loading...</SelectItem>}

          {categories?.map((category) => (
            <SelectItem
              key={category.id}
              className="w-full truncate"
              value={onIdChange ? category.id : category.name}
            >
              {category.name}
            </SelectItem>
          ))}
          <Separator />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="text-muted-foreground w-full justify-center"
              >
                Add a Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new category for organizing your questions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="category-name"
                    className="mb-1 block text-sm font-medium"
                  >
                    Name
                  </Label>
                  <Input
                    id="category-name"
                    maxLength={50}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Azure Services"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="category-description"
                    className="mb-1 block text-sm font-medium"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="category-description"
                    maxLength={500}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this category is for..."
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
        </SelectContent>
      </Select>
    </>
  );
}
