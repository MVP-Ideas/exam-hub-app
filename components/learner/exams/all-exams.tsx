"use client";

import ExamCardHorizontal from "@/components/admin/exams/list/exam-card-horizontal";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import useInfiniteExams from "@/hooks/exams/useInfiniteExams";
import { FileQuestion } from "lucide-react";

type Props = {
  category?: string;
  search?: string;
  difficulty?: string;
};

export default function AllExams({
  category = "",
  search = "",
  difficulty = "",
}: Props) {
  const { exams, isLoading, isFetching, isError, fetchNextPage, hasNextPage } =
    useInfiniteExams({
      category,
      search,
      difficulty,
      status: "published",
      page: 1,
      pageSize: 10,
    });

  const { ref: loaderRef, inView } = useInView({ rootMargin: "300px" });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <section className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col px-6 py-8">
      <h2 className="text-foreground mb-6 text-xl font-bold">All Exams</h2>
      <div className="flex w-full flex-1 flex-col gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </>
        ) : isError ? (
          <p className="text-muted-foreground text-sm">Error loading exams.</p>
        ) : exams.length === 0 ? (
          <div className="bg-muted flex min-h-48 w-full flex-1 flex-col items-center justify-center rounded-lg">
            <FileQuestion className="text-muted-foreground h-12 w-12" />
            <p className="text-muted-foreground text-xl font-semibold">
              No exams found.
            </p>
          </div>
        ) : (
          <>
            {exams.map((exam) => (
              <ExamCardHorizontal key={exam.id} exam={exam} route="/exams" />
            ))}
            {hasNextPage && (
              <div ref={loaderRef} className="text-center">
                {isFetching && <Skeleton className="h-24 w-full" />}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
