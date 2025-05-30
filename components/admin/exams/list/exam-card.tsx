import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useArchiveExam from "@/hooks/exams/useArchiveExam";
import { Exam } from "@/lib/types/exam";
import { getDifficultyColor, getStatusColor } from "@/lib/utils/exam";
import {
  MoreHorizontal,
  Edit,
  Tag,
  BarChart,
  Clock,
  Award,
  FileText,
  Archive,
  Flame,
} from "lucide-react";
import Link from "next/link";

type Props = {
  exam: Exam;
  route: string;
  disableOptions?: boolean;
};

export default function ExamCard({ exam, route, disableOptions }: Props) {
  const { archiveExam } = useArchiveExam(exam.id);
  const handleArchive = async () => {
    await archiveExam();
  };
  return (
    <Card
      key={exam.id}
      className="flex h-full flex-col overflow-hidden p-0 transition-shadow hover:shadow-lg"
    >
      <div className={`h-3 w-full ${getDifficultyColor(exam.difficulty)}`} />
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex flex-row items-center gap-2">
            <Badge
              hidden={!exam.isFeatured}
              variant="outline"
              className="bg-primary/20 border-0 text-blue-800"
            >
              <Flame className="mr-1 h-4 w-4" />
              Featured
            </Badge>
            <Badge
              hidden={disableOptions}
              variant="outline"
              className={`${getStatusColor(exam.status)} border-0`}
            >
              {exam.status}
            </Badge>
            <Badge
              variant="outline"
              className={`${getDifficultyColor(exam.difficulty)} border-0`}
            >
              {exam.difficulty}
            </Badge>
            <span className="text-muted-foreground text-xs">
              v{exam.version}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger hidden={disableOptions} asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                <Link
                  className="flex w-full flex-row items-center gap-2"
                  href={`/admin/exams/${exam.id}/edit`}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                hidden={!exam.status || exam.status === "Archived"}
                onClick={handleArchive}
                className="text-muted-foreground cursor-pointer"
              >
                <Archive className="mr-2 h-4 w-4" />
                <span>Archive</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="line-clamp-2 text-lg">{exam.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {exam.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        <div className="flex flex-col gap-2">
          {exam.categories.length > 0 && (
            <>
              <div className="text-muted-foreground flex flex-col items-start text-sm">
                <div className="flex flex-row items-center">
                  <Tag className="mr-2 h-4 w-4" />
                  <h3 className="text-sm">Categories:</h3>
                </div>
              </div>
              <div className="mb-2 flex flex-row flex-wrap items-center gap-2">
                {exam.categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant="outline"
                    className="border text-xs"
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="text-muted-foreground flex items-center text-sm">
              <BarChart className="mr-2 h-4 w-4" />
              <span>{exam.difficulty}</span>
            </div>
            <div className="text-muted-foreground flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4" />
              <span>{exam.durationSeconds / 60} minutes</span>
            </div>
            <div className="text-muted-foreground flex items-center text-sm">
              <Award className="mr-2 h-4 w-4" />
              <span>Pass: {exam.passingScore}%</span>
            </div>
            <div className="text-muted-foreground flex items-center text-sm">
              <FileText className="mr-2 h-4 w-4" />
              <span>
                {Array.isArray(exam.questions) ? exam.questions.length : 0}{" "}
                Questions
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto border-t p-4">
        <Link
          href={`${route}/${exam.id}`}
          className="bg-primary text-background w-full rounded-lg p-2 text-center text-sm font-semibold"
        >
          View Exam
        </Link>
      </CardFooter>
    </Card>
  );
}
