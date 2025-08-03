"use client";

import QuestionSheet from "@/components/admin/question-bank/QuestionSheet";
import QuestionTypeFilter from "@/components/admin/question-bank/QuestionTypeFilter";
import QuestionCategoryFilter from "@/components/categories/QuestionCategoryFilter";
import QuestionCardList from "@/components/questions/QuestionCardList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useDebouncedValue from "@/hooks/common/useDebouncedValue";
import useInfiniteQuestions from "@/hooks/questions/useInfiniteQuestions";
import { getFormattedQuestionType } from "@/lib/constants/question";
import { QuestionType } from "@/lib/types/questions";
import { CloudOff, FileQuestion, PlusIcon, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState<string>(
    searchParams.get("search") ?? "",
  );
  const [types, setTypes] = useState<string[]>(
    searchParams.get("types") ? searchParams.get("types")!.split(",") : [],
  );
  const [categories, setCategories] = useState<string[]>(
    searchParams.get("categories")
      ? searchParams.get("categories")!.split(",")
      : [],
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const debouncedSearch = useDebouncedValue(search, 300);

  const pageSize = 10;

  const queryParams = useMemo(
    () => ({
      page,
      search: debouncedSearch,
      pageSize,
      type: types.length > 0 ? types.join(",") : null,
      category: categories.length > 0 ? categories.join(",") : null,
    }),
    [page, debouncedSearch, types, categories],
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

  const handleClearFilters = () => {
    setCategories([]);
    setTypes([]);
    setPage(1);

    // Keep search but remove filter params
    const params = new URLSearchParams();
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }

    const queryString = params.toString();
    router.push(`?${queryString}`, { scroll: false });
  };

  // Reset page when search, category, type or pageSize changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categories, types, pageSize]);

  // Update URL with query params
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }

    if (types.length > 0) {
      params.set("types", types.join(","));
    }

    if (categories.length > 0) {
      params.set("categories", categories.join(","));
    }

    if (page > 1) {
      params.set("page", page.toString());
    }

    const queryString = params.toString();
    router.push(`?${queryString}`, { scroll: false });
  }, [debouncedSearch, categories, types, page, router]);

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center p-10">
      <div className="flex h-full w-full flex-col gap-6">
        <div className="flex w-full flex-row flex-wrap items-end justify-between gap-y-4">
          <div className="flex flex-col items-start">
            <h1 className="text-xl font-bold md:text-2xl">Question Bank</h1>
            <p className="text-sm">
              Manage, organize, and reuse questions across exams
            </p>
          </div>
          <QuestionSheet mode="create" showClose={false}>
            <Button variant="default" className="w-fit">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </QuestionSheet>
        </div>

        <div className="flex h-full w-full flex-col gap-4">
          <Input
            icon={<Search size={16} className="text-muted-foreground" />}
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
            <div className="w-full md:w-1/2">
              <QuestionTypeFilter
                selectedTypes={types}
                onChange={(value: string[]) => setTypes(value)}
              />
            </div>
            <div className="w-full md:w-1/2">
              <QuestionCategoryFilter
                selectedCategories={categories}
                onChange={(value: string[]) => setCategories(value)}
              />
            </div>
          </div>

          {(types.length > 0 || categories.length > 0) && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {types.map((type) => (
                <Badge
                  key={type}
                  variant="default"
                  className="flex items-center gap-1"
                >
                  {getFormattedQuestionType(type as QuestionType)}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-4 rounded-md border-none p-0 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTypes((prev) => prev.filter((t) => t !== type));
                    }}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              ))}
              {categories.map((categoryName) => (
                <Badge
                  key={categoryName}
                  variant="default"
                  className="flex items-center gap-1"
                >
                  {categoryName}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-4 rounded-md border-none p-0 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCategories((prev) =>
                        prev.filter((c) => c !== categoryName),
                      );
                    }}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="text-muted-foreground mx-2 size-4 text-xs hover:bg-transparent"
              >
                Clear all
              </Button>
            </div>
          )}

          <div className="flex h-full w-full flex-col rounded-lg">
            {!isLoading && !isError && questions && questions.length > 0 && (
              <div className="custom-scrollbar flex h-full flex-col gap-4">
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
              <div className="flex h-full w-full flex-col items-center gap-4 rounded-lg">
                {/* 4 skeletons */}
                <div className="flex w-full flex-col gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-20 w-full" />
                  ))}
                </div>
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
