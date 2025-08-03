import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import useCreateQuestionCategory from "@/hooks/question-categories/useCreateQuestionCategory";
import { QuestionCategory } from "@/lib/types/question-categories";
import { PlusIcon } from "lucide-react";

export default function QuestionCategoryAddDialog({
  isDialogOpen,
  setIsDialogOpen,
  onAddCategory,
  buttonStyles,
  buttonVariant,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  onAddCategory: (category: QuestionCategory) => void;
  buttonStyles?: string;
  buttonVariant?: "default" | "ghost";
}) {
  const { createQuestionCategory, isPending } = useCreateQuestionCategory();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleAddCategory = async () => {
    const newCategory = await createQuestionCategory({
      name: name.trim(),
      description: description.trim(),
    });

    onAddCategory(newCategory);
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant ?? "ghost"}
          className={`text-muted-foreground w-full justify-center ${buttonStyles}`}
          type="button"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Category
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
  );
}
