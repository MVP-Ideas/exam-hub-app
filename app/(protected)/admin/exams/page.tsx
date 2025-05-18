"use client";

import ExamDifficultySelect from "@/components/admin/exams/exam-difficulty-select";
import ExamStatusSelect from "@/components/admin/exams/exam-status-select";
import { Input } from "@/components/ui/input";
import useInfiniteExams from "@/hooks/exams/useInfiniteExams";
import {
  CloudOff,
  FileQuestion,
  LayoutGrid,
  List,
  PlusIcon,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ExamCard from "@/components/admin/exams/list/exam-card";
import ExamCardHorizontal from "@/components/admin/exams/list/exam-card-horizontal";
import ExamCategoryMultiselect from "@/components/categories/exam-category-multiselect";

export default function Page() {
  const [search, setSearch] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");

  const queryParams = useMemo(
    () => ({
      search,
      page,
      pageSize: 10,
      difficulty,
      category: categories.join(","),
      status,
    }),
    [search, page, difficulty, categories, status],
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

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center pb-10 md:pb-0">
      <div className="flex h-full w-full max-w-5xl flex-col items-center gap-6 p-10">
        <div className="flex w-full flex-row flex-wrap items-end justify-between gap-y-4">
          <div className="flex flex-col items-start">
            <h1 className="text-2xl font-bold">Exam Hub</h1>
            <p className="text-sm">
              View all your exams, edit them, and manage your exam settings
            </p>
          </div>
          <Link
            href={"exams/create"}
            className="bg-secondary hover:bg-secondary/80 flex w-fit flex-row items-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors duration-200"
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
            <ExamCategoryMultiselect
              value={categories}
              onChange={(value: string[]) => setCategories(value)}
            />
          </div>
        </div>
        <div className="flex h-full w-full flex-col gap-y-4">
          <div className="flex w-full flex-row items-center justify-end gap-1">
            <div className="border-muted-foreground/30 bg-muted flex w-full border-b" />
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              className="h-10 w-10"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid size={16} />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              className="h-10 w-10"
              onClick={() => setViewMode("list")}
            >
              <List size={16} />
            </Button>
          </div>
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
