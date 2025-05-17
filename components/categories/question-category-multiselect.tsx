"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tag, ChevronsUpDown, X } from "lucide-react";

import useQuestionCategories from "@/hooks/question-categories/useQuestionCategories";
import useCreateQuestionCategory from "@/hooks/question-categories/useCreateQuestionCategory";

type Props = {
  value?: string[];
  onChange?: (value: string[]) => void;
};

export default function QuestionCategoryMultiselect({
  value = [],
  onChange,
}: Props) {
  const { categories, isLoading } = useQuestionCategories();
  const { createQuestionCategory, isPending } = useCreateQuestionCategory();

  const [showOptions, setShowOptions] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleAddCategory = async () => {
    if (name.trim().length < 1) return;

    const newCategory = await createQuestionCategory({
      name: name.trim(),
      description: description.trim(),
    });

    setName("");
    setDescription("");
    setIsDialogOpen(false);

    if (onChange) {
      onChange([...value, newCategory.id]);
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    if (!onChange) return;

    const isSelected = value.includes(categoryId);

    if (isSelected) {
      onChange(value.filter((id) => id !== categoryId));
    } else {
      onChange([...value, categoryId]);
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    if (!onChange) return;
    onChange(value.filter((id) => id !== categoryId));
  };

  const handleClearAll = () => {
    if (!onChange) return;
    onChange([]);
  };

  const handleSelectAll = () => {
    if (!onChange || !categories) return;
    onChange(categories.map((category) => category.id));
  };

  const filteredCategories =
    searchQuery && categories
      ? categories.filter((category) =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : categories || [];

  const selectedCount = value.length;
  const allSelected = categories ? selectedCount === categories.length : false;
  const noneSelected = selectedCount === 0;

  const getCategoryName = (categoryId: string) => {
    const category = categories?.find((cat) => cat.id === categoryId);
    return category?.name || categoryId;
  };

  return (
    <div className="w-full">
      <Button
        variant="outline"
        className="mb-2 w-full justify-between font-normal"
        onClick={() => setShowOptions(!showOptions)}
        type="button"
      >
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 shrink-0 opacity-70" />
          {value.length === 0 ? (
            <span className="text-muted-foreground">Select categories</span>
          ) : (
            <span>{value.length} categories selected</span>
          )}
        </div>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {showOptions && (
        <div className="space-y-3 rounded-md border p-3">
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex items-center justify-between">
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

          <div className="max-h-[200px] space-y-2 overflow-y-auto">
            {isLoading ? (
              <div className="text-muted-foreground py-2 text-sm">
                Loading categories...
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={value.includes(category.id)}
                    onCheckedChange={() => handleSelectCategory(category.id)}
                    className="h-4 w-4"
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="flex-1 cursor-pointer text-sm leading-none"
                  >
                    {category.name}
                  </Label>
                </div>
              ))
            )}
          </div>

          <Separator />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="text-muted-foreground w-full justify-center"
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
        </div>
      )}

      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {value.map((categoryId) => (
            <Badge
              key={categoryId}
              variant="secondary"
              className="flex items-center gap-1 text-xs"
            >
              {getCategoryName(categoryId)}
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveCategory(categoryId);
                }}
                variant="ghost"
                size="icon"
                className="size-4"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
