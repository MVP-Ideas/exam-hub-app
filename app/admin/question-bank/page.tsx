"use client";

import QuestionSheet from "@/components/admin/question-bank/question-sheet";
import QuestionTypeSelect from "@/components/admin/question-bank/question-type-select";
import QuestionCategorySelect from "@/components/categories/question-category-select";
import QuestionCardList from "@/components/questions/question-card-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useDebouncedValue from "@/hooks/common/useDebouncedValue";
import useInfiniteQuestions from "@/hooks/questions/useInfiniteQuestions";
import { CloudOff, FileQuestion, PlusIcon, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { BeatLoader } from "react-spinners";

export default function Page() {
  const [search, setSearch] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search, 300);

  const pageSize = 10;

  const queryParams = useMemo(
    () => ({
      page,
      search: debouncedSearch,
      pageSize,
      type,
      category,
    }),
    [page, debouncedSearch, type, category],
  );

  const {
    questions,
    isLoading,
    isFetching,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuestions(queryParams);

  const { ref: loaderRef, inView } = useInView({
    rootMargin: "300px",
  });

  // Load next page when inView
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
      setPage((prev) => prev + 1);
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // Reset page when search, category, type or pageSize changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, type, pageSize]);

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center pb-10 md:pb-0">
      <div className="flex h-full w-full max-w-5xl flex-col items-center gap-6 p-10">
        <div className="flex w-full flex-row flex-wrap items-end justify-between gap-y-4">
          <div className="flex flex-col items-start">
            <h1 className="text-2xl font-bold">Question Bank</h1>
            <p className="text-sm">
              Manage, organize, and reuse questions across exams
            </p>
          </div>
          <QuestionSheet mode="create">
            <Button variant="secondary" className="w-fit">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </QuestionSheet>
        </div>

        <div className="bg-background border-primary/20 flex h-full w-full flex-col gap-4 rounded-lg border p-6">
          <Input
            icon={<Search size={16} className="text-muted-foreground" />}
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
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

          <div className="flex h-full w-full flex-col rounded-lg">
            {!isLoading && !isError && questions && questions.length > 0 && (
              <div className="custom-scrollbar flex h-full flex-col gap-4 md:max-h-[650px] md:overflow-y-auto">
                <QuestionCardList questions={questions} />
                {hasNextPage && (
                  <div ref={loaderRef} className="h-4 w-full text-center">
                    {isFetching && (
                      <p className="text-muted-foreground text-sm">
                        Loading more...
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {isLoading && (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg">
                <BeatLoader
                  size={20}
                  className="text-muted-foreground"
                  loading={isLoading}
                />
              </div>
            )}
            {isError && (
              <div className="bg-muted flex h-full w-full flex-1 flex-col items-center justify-center gap-4 rounded-lg">
                <CloudOff size={60} className="text-muted-foreground" />
                <p className="text-muted-foreground font-bold">
                  Error loading questions.
                </p>
              </div>
            )}
            {!isLoading && !isError && questions && questions.length === 0 && (
              <div className="bg-muted flex h-full w-full flex-1 flex-col items-center justify-center gap-4 rounded-lg">
                <FileQuestion size={60} className="text-muted-foreground" />
                <p className="text-muted-foreground font-bold">
                  No questions found.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
