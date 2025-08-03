import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { QuestionCategory } from "@/lib/types/question-categories";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckIcon, PencilIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface QuestionCategorySheetProps {
  children: React.ReactNode;
  category: QuestionCategory;
}

export default function QuestionCategorySheet({
  children,
  category,
}: QuestionCategorySheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && category) {
      setEditData({
        name: category.name,
        description: category.description,
        isActive: category.isActive,
      });
    }
    if (!open) {
      setIsEditing(false);
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving category:", editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (category) {
      setEditData({
        name: category.name,
        description: category.description,
        isActive: category.isActive,
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className="w-[500px] p-4 sm:max-w-[600px]"
        showClose={false}
      >
        <SheetHeader className="flex flex-row items-center gap-4 p-0 pb-4">
          <div className="flex w-full flex-row items-center justify-start gap-2">
            {isEditing ? (
              <Input
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
            ) : (
              <SheetTitle className="text-lg font-bold">
                {category?.name}
              </SheetTitle>
            )}

            <Badge
              variant={category?.isActive ? "default" : "secondary"}
              className={`rounded-lg text-sm ${
                category?.isActive ? "bg-green-500" : "bg-gray-500"
              }`}
            >
              {category?.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          {!isEditing ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <PencilIcon className="h-2 w-2" />
            </Button>
          ) : (
            <div className="flex flex-row items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(false)}
              >
                <XIcon className="h-2 w-2" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(false)}
              >
                <CheckIcon className="h-2 w-2" />
              </Button>
            </div>
          )}
        </SheetHeader>
        <div className="flex flex-col gap-2">
          {isEditing ? (
            <>
              <Textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="p-1"
              />
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground p-1">
                {category?.description || "No description provided"}
              </p>
            </div>
          )}
        </div>
        <Separator className="mx-2" />
      </SheetContent>
    </Sheet>
  );
}
