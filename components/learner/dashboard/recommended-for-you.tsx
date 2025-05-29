import ExamCardHorizontal from "@/components/admin/exams/list/exam-card-horizontal";
import { Skeleton } from "@/components/ui/skeleton";
import useGetExams from "@/hooks/exams/useExams";

export default function RecommendedForYou() {
  const { exams, isLoading } = useGetExams({
    search: "",
    page: 1,
    pageSize: 3,
    difficulty: "Beginner",
    status: "Published",
  });

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <Skeleton className="h-20 w-full rounded-md" />
      </div>
    );
  }

  if (exams.items.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <h2 className="text-foreground mb-6 text-xl font-bold">
        Recommended For You
      </h2>
      <div className="flex w-full flex-col gap-4">
        {exams.items.length > 0 &&
          exams.items.map((exam) => (
            <ExamCardHorizontal
              route={`/exams`}
              disableOptions
              exam={exam}
              key={exam.id}
            />
          ))}
      </div>
    </div>
  );
}
