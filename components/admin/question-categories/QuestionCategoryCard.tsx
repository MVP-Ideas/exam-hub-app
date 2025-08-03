import { QuestionCategory } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Calendar } from "lucide-react";
import QuestionCategorySheet from "./QuestionCategorySheet";

interface QuestionCategoryCardProps {
  category: QuestionCategory;
}

export default function QuestionCategoryCard({
  category,
}: QuestionCategoryCardProps) {
  // Generate a consistent color based on category name
  const getColorFromName = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-orange-500",
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <QuestionCategorySheet category={category}>
      <Card className="cursor-pointer transition-shadow duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex w-full flex-row items-center justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-semibold">
                {category.name}
              </h3>
            </div>
            <Badge
              variant={category.isActive ? "default" : "secondary"}
              className={`text-xs ${
                category.isActive ? "bg-green-500" : "bg-gray-500"
              }`}
            >
              {category.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-y-2">
          {/* Question count and status */}
          <div className="flex flex-row items-start justify-between gap-x-2 gap-y-2">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4" />
              <span>{category.usageCount || 0} questions</span>
            </div>

            {/* Creation date */}
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>Created {formatDate(category.createdAt)}</span>
            </div>
          </div>
          {/* Description */}
          {category.description && (
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {category.description}
            </p>
          )}
        </CardContent>
      </Card>
    </QuestionCategorySheet>
  );
}
