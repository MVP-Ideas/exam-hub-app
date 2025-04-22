"use client";

import QuestionCategorySelect from "@/components/admin/question-bank/question-category-select";
import questionColumn from "@/components/admin/question-bank/question-column";
import QuestionSheet from "@/components/admin/question-bank/question-sheet";
import QuestionTypeSelect from "@/components/admin/question-bank/question-type-select";
import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useDebouncedValue from "@/hooks/common/useDebouncedValue";
import useGetQuestions from "@/hooks/questions/useQuestions";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { PlusIcon, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [type, setType] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const debouncedSearch = useDebouncedValue(search, 300);

  const columns = questionColumn();

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      page: page,
      pageSize: 10,
      type: type || "",
      category: category || "",
    }),
    [category, debouncedSearch, page, type],
  );

  const { questions, isLoading, isError } = useGetQuestions(queryParams);

  const table = useReactTable({
    data: questions?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleNextPage = () => {
    if (questions && questions.page < questions.totalPages) {
      setPage(questions.page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (questions && questions.page > 1) {
      setPage(questions.page - 1);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams({
      search: debouncedSearch,
      page: page.toString(),
      type: type || "",
      category: category || "",
    }).toString();

    router.push(`?${queryParams}`, { scroll: false });
  }, [debouncedSearch, page, type, router, category]);

  return (
    <div className="flex h-full w-full flex-col items-center">
      <div className="flex w-full max-w-5xl flex-col items-center justify-between gap-6 p-10">
        <div className="flex w-full flex-row items-end justify-between">
          <div className="flex flex-col items-start">
            <h1 className="text-2xl font-bold">Question Bank</h1>
            <p className="text-sm">
              Manage, organize, and reuse questions across exams
            </p>
          </div>
          <QuestionSheet mode="create">
            <Button variant="default" className="w-fit">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </QuestionSheet>
        </div>
        <div className="bg-background border-primary/20 flex w-full flex-col gap-4 rounded-lg border p-6">
          <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
            <Input
              icon={<Search size={16} className="text-muted-foreground" />}
              placeholder="Search questions...."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
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

          <DataTable
            table={table}
            tableName="Questions"
            columns={columns}
            isLoading={isLoading}
            isError={isError}
            pagination={questions}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
          />
        </div>
      </div>
    </div>
  );
}
