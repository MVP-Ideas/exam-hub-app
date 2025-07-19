"use client";

import ExamDifficultySelect from "@/components/admin/exams/ExamDifficultySelect";
import ExamStatusSelect from "@/components/admin/exams/ExamStatusSelect";
import { Input } from "@/components/ui/input";
import useInfiniteExams from "@/hooks/exams/useInfiniteExams";
import {
  CloudOff,
  FileQuestion,
  LayoutGrid,
  List,
  PlusIcon,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ExamCard from "@/components/admin/exams/list/ExamCard";
import ExamCardHorizontal from "@/components/admin/exams/list/ExamCardHorizontal";
import ExamCategoryFilter from "@/components/categories/ExamCategoryFilter";
import useDebouncedValue from "@/hooks/common/useDebouncedValue";
import useExamCategories from "@/hooks/exam-categories/useExamCategories";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState<string>(
    searchParams.get("search") ?? "",
  );
  const [difficulty, setDifficulty] = useState<string>(
    searchParams.get("difficulty") ?? "",
  );
  const [categories, setCategories] = useState<string[]>(
    searchParams.get("categories")
      ? searchParams.get("categories")!.split(",")
      : [],
  );
  const [status, setStatus] = useState<string>(
    searchParams.get("status") ?? "",
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [viewMode, setViewMode] = useState(
    searchParams.get("viewMode") ?? "grid",
  );
  const debouncedSearch = useDebouncedValue(search, 500);

  const { categories: examCategories } = useExamCategories();

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      page,
      pageSize: 10,
      difficulty: difficulty === "" ? null : difficulty,
      category: categories.join(","),
      status: status === "" ? null : status,
    }),
    [debouncedSearch, page, difficulty, categories, status],
  );

  const { exams, isLoading, isFetching, isError, fetchNextPage, hasNextPage } =
    useInfiniteExams(queryParams);

  const { ref: loaderRef, inView } = useInView({
    rootMargin: "300px",
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
      setPage((prev) => prev + 1);
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    setPage(1);
  }, [search, categories, difficulty, status]);

  // Update URL with query params
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }

    if (difficulty) {
      params.set("difficulty", difficulty);
    }

    if (categories.length > 0) {
      params.set("categories", categories.join(","));
    }

    if (status) {
      params.set("status", status);
    }

    if (page > 1) {
      params.set("page", page.toString());
    }

    if (viewMode !== "grid") {
      params.set("viewMode", viewMode);
    }

    const queryString = params.toString();
    router.push(`?${queryString}`, { scroll: false });
  }, [debouncedSearch, difficulty, categories, status, page, viewMode, router]);

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center p-10">
      <div className="flex h-full w-full flex-col items-center gap-6">
        <div className="flex w-full flex-row flex-wrap items-end justify-between gap-y-4">
          <div className="flex flex-col items-start">
            <h1 className="text-2xl font-bold">Exam Hub</h1>
            <p className="text-sm">
              View all your exams, edit them, and manage your exam settings
            </p>
          </div>
          <Link
            href={"exams/create"}
            className="bg-primary hover:bg-primary/80 flex w-fit flex-row items-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors duration-200"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Exam
          </Link>
        </div>

        <div className="flex h-fit w-full flex-col gap-4 rounded-lg p-0">
          <Input
            icon={<Search size={16} className="text-muted-foreground" />}
            placeholder="Search exams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
            <ExamDifficultySelect
              value={difficulty}
              onChange={(value: string) => setDifficulty(value || "")}
              includeNull
            />
            <ExamStatusSelect
              value={status}
              onChange={(value: string) => setStatus(value || "")}
              includeNull
            />
          </div>
          <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
            <ExamCategoryFilter
              selectedCategories={categories}
              onChange={(value: string[]) => setCategories(value)}
            />
          </div>

          {(difficulty || status || categories.length > 0) && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {difficulty && (
                <Badge variant="default" className="flex items-center gap-1">
                  {difficulty}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-4 rounded-md border-none p-0 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDifficulty("");
                    }}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              )}
              {status && (
                <Badge variant="default" className="flex items-center gap-1">
                  {status}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-4 rounded-md border-none p-0 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setStatus("");
                    }}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              )}
              {categories.map((categoryId) => {
                const category = examCategories?.find(
                  (c) => c.id === categoryId,
                );
                return (
                  <Badge
                    key={categoryId}
                    variant="default"
                    className="flex items-center gap-1"
                  >
                    {category?.name || categoryId}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-4 rounded-md border-none p-0 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCategories((prev) =>
                          prev.filter((c) => c !== categoryId),
                        );
                      }}
                    >
                      <X size={12} />
                    </Button>
                  </Badge>
                );
              })}
              <Button
                variant="ghost"
                onClick={() => {
                  setDifficulty("");
                  setStatus("");
                  setCategories([]);
                  setPage(1);

                  // Keep search and viewMode but remove filter params
                  const params = new URLSearchParams();
                  if (debouncedSearch) {
                    params.set("search", debouncedSearch);
                  }
                  if (viewMode !== "grid") {
                    params.set("viewMode", viewMode);
                  }

                  const queryString = params.toString();
                  router.push(`?${queryString}`, { scroll: false });
                }}
                className="text-muted-foreground mx-2 size-4 text-xs hover:bg-transparent"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
        <div className="flex h-full w-full flex-col gap-y-4">
          <div className="flex w-full flex-row items-center justify-end gap-1">
            <div className="border-muted-foreground/30 bg-muted flex w-full border-b" />
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              className="h-10 w-10"
              onClick={() => {
                setViewMode("grid");

                // Update URL with current params but change viewMode
                const params = new URLSearchParams();
                if (debouncedSearch) params.set("search", debouncedSearch);
                if (difficulty) params.set("difficulty", difficulty);
                if (categories.length > 0)
                  params.set("categories", categories.join(","));
                if (status) params.set("status", status);
                if (page > 1) params.set("page", page.toString());

                const queryString = params.toString();
                router.push(`?${queryString}`, { scroll: false });
              }}
            >
              <LayoutGrid size={16} />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              className="h-10 w-10"
              onClick={() => {
                setViewMode("list");

                // Update URL with current params but change viewMode
                const params = new URLSearchParams();
                if (debouncedSearch) params.set("search", debouncedSearch);
                if (difficulty) params.set("difficulty", difficulty);
                if (categories.length > 0)
                  params.set("categories", categories.join(","));
                if (status) params.set("status", status);
                if (page > 1) params.set("page", page.toString());
                params.set("viewMode", "list");

                const queryString = params.toString();
                router.push(`?${queryString}`, { scroll: false });
              }}
            >
              <List size={16} />
            </Button>
          </div>
          {isLoading && (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-4 md:grid-cols-2"
                  : "flex flex-col gap-4"
              }
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-56 w-full" />
              ))}
            </div>
          )}
          {!isLoading && (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-4 md:grid-cols-2"
                  : "flex flex-col gap-4"
              }
            >
              {exams?.length > 0 &&
                exams.map((exam) =>
                  viewMode === "grid" ? (
                    <ExamCard route="/admin/exams" key={exam.id} exam={exam} />
                  ) : (
                    <ExamCardHorizontal
                      route="/admin/exams"
                      key={exam.id}
                      exam={exam}
                    />
                  ),
                )}

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

          {isLoading &&
            (viewMode === "grid" ? (
              <div className="grid h-full w-full grid-cols-2 gap-4">
                <Skeleton className="bg-background h-96 w-full" />
                <Skeleton className="bg-background h-96 w-full" />
              </div>
            ) : (
              <div className="flex h-full w-full flex-col gap-4">
                <Skeleton className="bg-background h-48 w-full" />
                <Skeleton className="bg-background h-48 w-full" />
              </div>
            ))}

          {isError && (
            <div className="bg-muted flex h-full w-full flex-1 flex-col items-center justify-center gap-4 rounded-lg">
              <CloudOff size={60} className="text-muted-foreground" />
              <p className="text-muted-foreground font-bold">
                Error loading exams.
              </p>
            </div>
          )}

          {!isLoading && !isError && exams && exams.length === 0 && (
            <div className="bg-muted flex h-full w-full flex-1 flex-col items-center justify-center gap-4 rounded-lg">
              <FileQuestion size={60} className="text-muted-foreground" />
              <p className="text-muted-foreground font-bold">No exams found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
