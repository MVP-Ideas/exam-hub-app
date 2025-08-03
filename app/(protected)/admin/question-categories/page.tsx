"use client";

import QuestionCategoryAddDialog from "@/components/admin/question-categories/QuestionCategoryAddDialog";
import QuestionCategoryCard from "@/components/admin/question-categories/QuestionCategoryCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useQuestionCategories from "@/hooks/question-categories/useQuestionCategories";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState<string>(
    searchParams.get("search") ?? "",
  );

  const { categories, isLoading } = useQuestionCategories({
    search,
  });

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center p-10">
      <div className="flex h-full w-full flex-col gap-6">
        {/* Header */}
        <div className="flex w-full flex-row items-end justify-between gap-y-4">
          <div className="flex flex-col items-start">
            <h1 className="text-xl font-bold md:text-2xl">
              Question Categories
            </h1>
            <p className="text-sm">
              Manage question categories and their associated questions
            </p>
          </div>
          <QuestionCategoryAddDialog
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            onAddCategory={() => {}}
            buttonStyles="w-fit text-primary-foreground"
            buttonVariant="default"
          />
        </div>

        <div className="flex h-full w-full flex-col gap-4">
          <Input
            icon={<Search size={16} className="text-muted-foreground" />}
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {!isLoading &&
              categories?.map((category) => (
                <QuestionCategoryCard key={category.id} category={category} />
              ))}
            {isLoading && (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-48 w-full rounded-lg" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
