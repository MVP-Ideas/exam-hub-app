"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Search, FileQuestionIcon, CloudOff } from "lucide-react";
import useDebouncedValue from "@/hooks/common/useDebouncedValue";
import QuestionTypeSelect from "@/components/admin/question-bank/QuestionTypeSelect";
import QuestionCategorySelect from "@/components/categories/QuestionCategorySelect";
import { useInView } from "react-intersection-observer";
import useInfiniteQuestions from "@/hooks/questions/useInfiniteQuestions";
import QuestionCardList from "@/components/questions/QuestionCardList";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelect: (id: string) => void;
  addedQuestionIds: string[];
};

export default function QuestionPickerSheet({
  open,
  setOpen,
  onSelect,
  addedQuestionIds = [],
}: Props) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search, 300);

  const { questions, isLoading, isError, hasNextPage, fetchNextPage } =
    useInfiniteQuestions({
      search: debouncedSearch,
      page: page,
      pageSize: 10,
      type: type,
      category: category,
    });

  const { ref: loaderRef, inView } = useInView({
    rootMargin: "200px",
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      setPage((prev) => prev + 1);
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handleSelect = (id: string) => {
    onSelect(id);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        showClose={false}
        className="w-full overflow-y-auto p-6 md:min-w-[95vw] lg:min-w-[65vw]"
      >
        <SheetHeader className="flex flex-col items-start p-0">
          {/* <SheetClose
            className="mb-2 w-fit cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <div className="bg-primary text-primary-foreground w-full rounded-lg p-2">
              <div className="flex items-center gap-2">
                <MoveLeftIcon size={16} className="text-background" />
                <span className="text-background text-sm font-bold">
                  Back to Question Bank
                </span>
              </div>
            </div>
          </SheetClose> */}
          <SheetTitle>Select an Existing Question</SheetTitle>
          <SheetDescription>
            Search and filter to reuse a question
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex h-full flex-1 flex-col gap-4">
          <Input
            icon={<Search size={16} className="text-muted-foreground" />}
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <QuestionTypeSelect
              value={type}
              onChange={(value: string) => setType(value || "")}
              includeNull
            />
            <QuestionCategorySelect
              value={category}
              onChange={(value: string) => setCategory(value || "")}
              includeNull
            />
          </div>

          <div className="mt-2 flex h-full flex-col gap-4">
            {!isLoading && questions && questions.length === 0 && (
              <div className="bg-muted flex h-full min-h-[400px] w-full flex-1 flex-col items-center justify-center gap-4 rounded-lg">
                <FileQuestionIcon size={60} className="text-muted-foreground" />
                <p className="text-muted-foreground font-bold">
                  No questions found.
                </p>
              </div>
            )}

            {/* Questions */}

            {questions && (
              <QuestionCardList
                questions={questions}
                addedQuestionIds={addedQuestionIds}
                onSelect={handleSelect}
              />
            )}

            {isLoading && (
              <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center gap-4 rounded-lg">
                {/* Skeletons */}
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            )}
            {isError && (
              <div className="bg-muted flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg">
                <CloudOff size={60} className="text-muted-foreground" />
                <p className="text-muted-foreground font-bold">
                  Error loading questions.
                </p>
              </div>
            )}
            <div ref={loaderRef} className="h-5" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
