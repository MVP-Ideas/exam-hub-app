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
import { formatDuration } from "date-fns";
import {
  Tag,
  Clock,
  Award,
  FileText,
  MoreHorizontal,
  Edit,
  Archive,
} from "lucide-react";
import Link from "next/link";

type Props = {
  exam: Exam;
};

export default function ExamCardHorizontal({ exam }: Props) {
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
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-muted-foreground flex items-center text-sm">
                <Tag className="mr-2 h-4 w-4" />
                <span className="truncate">{exam.category}</span>
              </div>
              <div className="text-muted-foreground flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4" />
                <span>{formatDuration({ seconds: exam.durationSeconds })}</span>
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
          <Button variant="secondary" className="flex-1">
            View
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10">
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
