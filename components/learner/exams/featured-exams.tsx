import ExamCardHorizontal from "@/components/admin/exams/list/exam-card-horizontal";
import { Skeleton } from "@/components/ui/skeleton";
import useGetExams from "@/hooks/exams/useExams";

export default function FeaturedExams() {
  const { exams, isLoading } = useGetExams({
    page: 1,
    pageSize: 2,
    search: "",
    difficulty: "",
    status: "published",
  });

  const top2exams = exams?.items.slice(0, 2).map((exam) => ({
    ...exam,
    isFeatured: true,
  }));

  if (!isLoading && (!top2exams || top2exams.length === 0)) {
    return <></>; // Don't render anything if no featured exams and not loading
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-8">
      <h2 className="text-foreground mb-6 text-xl font-bold">Featured Exams</h2>

      <div className="flex w-full flex-col gap-4">
        {isLoading ? (
          <Skeleton className="h-40 w-full rounded-lg" />
        ) : (
          top2exams?.map((exam) => (
            <ExamCardHorizontal
              disableOptions
              key={exam.id}
              exam={exam}
              route="/exams"
            />
          ))
        )}
      </div>
    </section>
  );
}
