"use client";

import ExamListSelect from "@/components/admin/exams/sessions/exam-list-select";
import ExamSessionStatusSelect from "@/components/admin/exams/sessions/exam-session-status-select";
import UserMultiSelect from "@/components/admin/exams/sessions/user-multi-select";
import useInfiniteExamSessions from "@/hooks/exam-sessions/useInfiniteExamSessions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  CheckCircle,
  CheckCircle2Icon,
  Clock,
  Clock1,
  CloudOff,
  FileQuestion,
  MessageSquareWarning,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { formatTime } from "@/lib/date-utils";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [page, setPage] = useState(1);

  const {
    examSessions,
    isLoading,
    isFetching,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteExamSessions({
    status: selectedStatus,
    examId: selectedExam,
    userIds: selectedUsers.length > 0 ? selectedUsers : undefined,
    pageSize: 10,
    page: page,
  });

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
  }, [selectedStatus, selectedExam, selectedUsers]);

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center p-10 md:pb-10">
      <div className="flex h-full w-full flex-col items-center gap-6">
        <div className="flex w-full flex-row flex-wrap items-end justify-between gap-y-4">
          <div className="flex flex-col items-start">
            <h1 className="text-2xl font-bold">Exam Sessions</h1>
            <p className="text-sm">View and manage exam sessions.</p>
          </div>
          <div className="flex w-full flex-col items-center gap-2 md:flex-row">
            <ExamListSelect
              value={selectedExam}
              onChange={setSelectedExam}
              includeNull={true}
            />
            <ExamSessionStatusSelect
              value={selectedStatus}
              onChange={setSelectedStatus}
              includeNull={true}
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-4">
          <UserMultiSelect value={selectedUsers} onChange={setSelectedUsers} />
        </div>

        {/* Sessions List */}
        <div className="flex h-full w-full flex-col gap-y-2">
          {isLoading && (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          )}
          {!isLoading && (
            <div className="flex flex-col gap-4">
              {examSessions?.length > 0 &&
                examSessions.map((session) => (
                  <Card
                    key={session.id}
                    className={cn(
                      "px-4 py-6 transition-colors duration-200 ease-in-out hover:bg-gray-50",
                      session.status !== "InProgress" && "cursor-pointer",
                      session.status === "InProgress" && "cursor-not-allowed",
                    )}
                    onClick={() => {
                      if (session.status === "InProgress") {
                        return null;
                      }
                      if (session.status === "Completed") {
                        router.push(
                          `/admin/exams/sessions/results/${session.id}`,
                        );
                      }
                      if (session.status === "ToBeReviewed") {
                        router.push(
                          `/admin/exams/sessions/reviews/${session.id}`,
                        );
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <CardHeader className="flex flex-wrap items-center justify-between">
                      <div className="flex flex-col items-start gap-x-4 gap-y-2 md:flex-row md:items-center">
                        <div className="bg-primary/20 flex h-full items-center justify-center rounded-full p-4">
                          <User className="text-primary h-4 w-4 md:h-6 md:w-6" />
                        </div>
                        <div className="flex flex-col flex-wrap text-wrap">
                          <CardTitle className="text-xs font-semibold md:text-lg">
                            {session.user.name}
                          </CardTitle>
                          <p className="text-muted-foreground text-xs text-wrap md:text-sm">
                            {session.user.email}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          "px-3 py-1 text-sm",
                          session.status === "ToBeReviewed"
                            ? "bg-yellow-100 text-yellow-800"
                            : session.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800",
                        )}
                      >
                        {session.status === "Completed" && (
                          <CheckCircle className="mr-1 h-4 w-4" />
                        )}
                        {session.status === "InProgress" && (
                          <Clock1 className="mr-1 h-4 w-4" />
                        )}
                        {session.status === "ToBeReviewed" && (
                          <MessageSquareWarning className="mr-1 h-4 w-4" />
                        )}
                        {session.status === "InProgress"
                          ? "In Progress"
                          : session.status === "ToBeReviewed"
                            ? "To Be Reviewed"
                            : "Completed"}
                      </Badge>
                    </CardHeader>
                    <CardContent className="flex w-full flex-col gap-2">
                      <div className="w-full rounded-lg bg-gray-50 p-4">
                        <div className="mb-2 flex w-full items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-600">
                            Exam
                          </span>
                        </div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {session.exam.title}
                        </h4>
                      </div>
                      <div className="bg-primary/20 w-full rounded-lg p-4">
                        <div className="mb-2 flex w-full items-center space-x-2">
                          <CheckCircle2Icon className="text-primary h-4 w-4" />
                          <span className="text-primary text-sm font-medium">
                            Started At
                          </span>
                        </div>
                        <p className="text-primary text-lg font-semibold">
                          {new Date(session.startedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="w-full rounded-lg bg-green-100 p-4">
                        <div className="mb-2 flex w-full items-center space-x-2">
                          <CheckCircle2Icon className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">
                            Finished At
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-green-600">
                          {session.finishedAt
                            ? new Date(session.finishedAt).toLocaleString()
                            : "In Progress"}
                        </p>
                      </div>
                      <Separator />
                      <div className="flex w-full flex-row items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-base font-medium">
                            Time Spent
                          </span>
                        </div>
                        <span className="text-lg font-semibold">
                          {session.timeSpentSeconds
                            ? formatTime(session.timeSpentSeconds)
                            : "0 min 0 sec"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}

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
            <div className="flex h-full w-full flex-col gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="bg-background h-48 w-full" />
              ))}
            </div>
          )}

          {isError && (
            <div className="bg-muted flex h-full w-full flex-1 flex-col items-center justify-center gap-4 rounded-lg">
              <CloudOff size={60} className="text-muted-foreground" />
              <p className="text-muted-foreground font-bold">
                Error loading exam sessions.
              </p>
            </div>
          )}

          {!isLoading &&
            !isError &&
            examSessions &&
            examSessions.length === 0 && (
              <div className="bg-muted flex h-full w-full flex-1 flex-col items-center justify-center gap-4 rounded-lg">
                <FileQuestion size={60} className="text-muted-foreground" />
                <p className="text-muted-foreground font-bold">
                  No exam sessions found.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
