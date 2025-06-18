"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useArchiveExam from "@/hooks/exams/useArchiveExam";
import { Exam } from "@/lib/types/exam";
import { getStatusColor, getDifficultyColor } from "@/lib/utils/exam";
import {
  Tag,
  Clock,
  Award,
  FileText,
  MoreHorizontal,
  Edit,
  Archive,
  Flame,
  BarChart,
} from "lucide-react";
import Link from "next/link";

type Props = {
  exam: Exam;
  route: string;
  disableOptions?: boolean;
};

export default function ExamCardHorizontal({
  exam,
  route,
  disableOptions = false,
}: Props) {
  const { archiveExam } = useArchiveExam(exam.id);
  const handleArchive = async () => {
    await archiveExam();
  };
  return (
    <Card
      key={exam.id}
      className="flex w-full flex-row overflow-hidden p-0 transition-shadow hover:shadow-md"
    >
      {/* Colored indicator */}
      <div className={`w-2 ${getDifficultyColor(exam.difficulty)}`} />

      {/* Content */}
      <div className="flex w-full flex-col py-2 pl-0">
        {/* Main info */}
        <div className="flex flex-col gap-2 p-4">
          <CardHeader className="p-0">
            <div className="flex items-center gap-2">
              <Badge
                hidden={!exam.isFeatured}
                variant="outline"
                className={`bg-primary/20 border-0 text-blue-800`}
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
            <CardTitle className="text-lg">{exam.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {exam.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <div className="text-muted-foreground flex flex-col items-start text-sm">
              {exam.categories.length > 0 && (
                <>
                  <div className="flex flex-row items-center">
                    <Tag className="mr-2 h-4 w-4" />
                    <h3 className="text-sm">Categories:</h3>
                  </div>

                  <div className="my-2 flex flex-row flex-wrap items-center gap-2">
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
            </div>

            <div className="flex flex-row flex-wrap items-center gap-4">
              <div className="text-muted-foreground flex items-center text-sm">
                <BarChart className="mr-2 h-4 w-4" />
                <span>{exam.difficulty}</span>
              </div>
              <div className="text-muted-foreground flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4" />
                <span>
                  {exam.durationSeconds
                    ? `${exam.durationSeconds / 60} minutes`
                    : "No Time Limit"}
                </span>
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
          </CardContent>
        </div>

        {/* Actions */}
        <CardFooter className="flex w-full flex-row gap-2 pr-4 pb-2 pl-0">
          <Link
            href={`${route}/${exam.id}`}
            className="bg-primary text-primary-foreground w-full rounded-lg p-2 text-center text-sm font-semibold"
          >
            View Exam
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger hidden={disableOptions} asChild>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                <Link
                  className="flex w-full flex-row items-center gap-2"
                  href={`${route}/${exam.id}/edit`}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleArchive}
                className="text-muted-foreground cursor-pointer"
              >
                <Archive className="mr-2 h-4 w-4" />
                <span>Archive</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </div>
    </Card>
  );
}
