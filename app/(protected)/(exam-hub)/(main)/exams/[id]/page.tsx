"use client";

import { useParams, useRouter } from "next/navigation";
import useExamById from "@/hooks/exams/useExamById";

import {
  Users,
  CalendarIcon,
  Clock,
  FileText,
  BarChart,
  BookOpen,
  CheckCircle,
  Clock3,
  FileQuestion,
  CheckCircleIcon,
  XCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import ResourceCard from "@/components/admin/resources/resource-card";
import { DialogClose } from "@/components/ui/dialog";
import { formatUTCDate } from "@/lib/date-utils";
import useStartExamSession from "@/hooks/exam-sessions/useStartExamSession";
import { toast } from "sonner";
import { useState } from "react";
import AppLoader from "@/components/common/app-loader";
import { getDifficultyColor } from "@/lib/utils/exam";

export default function Page() {
  const { id } = useParams();
  const { exam, isLoading, isError } = useExamById(id as string);
  const { startExamSession, isPending } = useStartExamSession(id as string);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const resources = exam?.resources || [];
  const router = useRouter();

  const handleStartExamSession = async () => {
    const response = await startExamSession();

    if (response) {
      router.push(`/sessions/${response.id}`);
    } else {
      toast.error("Failed to start exam session");
    }
  };

  if (isLoading || isError || !exam) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <AppLoader />
      </div>
    );
  }

  // Get the sessions to display
  const displayedSessions =
    exam.previousSessions && exam.previousSessions.length > 0
      ? showAllHistory
        ? exam.previousSessions
        : exam.previousSessions.slice(0, 3)
      : [];

  const hasMoreSessions =
    exam.previousSessions && exam.previousSessions.length > 3;

  return (
    <div className="bg-accent h-full min-h-screen pb-20 md:pb-10">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 to-purple-900">
        <div className="absolute inset-0 bg-black opacity-30" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end p-6">
          <div className="mb-2 flex space-x-2 text-sm">
            <Badge
              variant="secondary"
              className={`border-0 ${getDifficultyColor(exam.difficulty)}`}
            >
              {exam.difficulty}
            </Badge>
            {exam.categories?.length > 0 && (
              <Badge variant="default" className="bg-indigo-600">
                {exam.categories?.length}{" "}
                {exam.categories.length === 1 ? "Competency" : "Competencies"}
              </Badge>
            )}
          </div>
          <h1 className="text-primary-foreground mb-2 text-3xl font-bold">
            {exam.title}
          </h1>
          <div className="text-primary-foreground flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <Users size={16} className="mr-1" />
              <span>1,293 Students</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon size={16} className="mr-1" />
              <span>Updated {formatUTCDate(exam.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About This Exam</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{exam.description}</p>
                <Separator className="my-6" />
                <h3 className="mb-4 text-lg font-medium">
                  What You&apos;ll Learn
                </h3>
                <ul className="space-y-3">
                  {[
                    `Demonstrate your knowledge in ${exam.categories?.map((category) => category.name).join(", ") || "this field"}`,
                    "Gain certification in core industry concepts",
                    "Enhance your resume with verified skills",
                  ].map((text) => (
                    <li key={text} className="flex items-start">
                      <CheckCircle
                        size={20}
                        className="mt-0.5 mr-3 flex-shrink-0 text-green-500"
                      />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Structure */}
            <Card>
              <CardHeader>
                <CardTitle>Exam Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    {
                      Icon: Clock3,
                      label: "Time Limit",
                      value: `${
                        exam.durationSeconds
                          ? `${exam.durationSeconds / 60} minutes`
                          : "None"
                      }`,
                    },
                    {
                      Icon: FileText,
                      label: "Questions",
                      value: `${exam.questions.length}`,
                    },
                    {
                      Icon: BarChart,
                      label: "Passing Score",
                      value: `${exam.passingScore}%`,
                    },
                  ].map(({ Icon, label, value }) => (
                    <div
                      key={label}
                      className="bg-accent flex items-center rounded-md p-3"
                    >
                      <Icon size={20} className="text-primary mr-3" />
                      <div>
                        <div className="text-muted-foreground text-sm">
                          {label}
                        </div>
                        <div className="font-medium">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  {exam.categories?.length > 0 && (
                    <div className="bg-accent flex items-center rounded-md p-3">
                      <BookOpen
                        size={20}
                        className="text-primary mr-3 shrink-0"
                      />
                      <div>
                        <div className="text-muted-foreground text-sm">
                          Categories
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1 font-medium">
                          {exam.categories?.map((category) => (
                            <Badge
                              key={category.id}
                              variant="default"
                              className="text-xs"
                            >
                              {category.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            {resources && resources.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Study Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resources ? (
                    resources.map((resource) => (
                      <ResourceCard
                        resourceId={resource.id}
                        key={resource.id}
                      />
                    ))
                  ) : (
                    <div className="bg-muted flex h-full w-full flex-1 flex-col items-center justify-center gap-4 rounded-lg p-10">
                      <FileQuestion
                        size={48}
                        className="text-muted-foreground"
                      />
                      <p className="text-muted-foreground font-bold">
                        No resources found.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Exam History */}
            {exam.previousSessions && exam.previousSessions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Exam History</CardTitle>
                  <CardDescription>
                    {exam.previousSessions.length} previous attempt
                    {exam.previousSessions.length !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {displayedSessions.map((session) => (
                    <div
                      key={session.examSessionId}
                      className="bg-card hover:bg-accent/50 flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors"
                      onClick={() => {
                        router.push(`/results/${session.examSessionId}`);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {session.passingFlag === "Passed" ? (
                          <div className="flex items-center gap-2">
                            <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-green-700">
                              Passed
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <XCircleIcon className="h-5 w-5 text-red-600" />
                            <span className="font-medium text-red-700">
                              Failed
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="text-muted-foreground flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="text-foreground font-medium">
                            {session.scorePercentage}%
                          </p>
                          <p className="text-xs">Score</p>
                        </div>
                        <div className="text-right">
                          <p className="text-foreground font-medium">
                            {new Date(session.finishedAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs">
                            {new Date(session.finishedAt).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {hasMoreSessions && (
                    <div className="flex justify-center pt-2">
                      <button
                        onClick={() => setShowAllHistory(!showAllHistory)}
                        className="text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
                      >
                        {showAllHistory ? (
                          <>
                            <ChevronUpIcon className="h-4 w-4" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDownIcon className="h-4 w-4" />
                            Show {exam.previousSessions.length - 3} More
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Exam Card */}
          <Card className="sticky top-8">
            <CardContent>
              <div className="mb-6 text-center">
                <div className="mb-2 text-3xl font-bold">Free</div>
                <p className="text-muted-foreground text-sm">
                  No payment required
                </p>
              </div>

              {exam.existingOngoingSession &&
              exam.existingOngoingSession.existingExamSessionId ? (
                // Resume existing exam session
                <Button
                  className="mb-6 w-full"
                  disabled={isPending}
                  onClick={() => {
                    router.push(
                      `/sessions/${exam.existingOngoingSession.existingExamSessionId}`,
                    );
                  }}
                >
                  Resume Exam
                </Button>
              ) : (
                // Start new exam session
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mb-6 w-full">Start Exam</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ready to start the exam?</DialogTitle>
                      <DialogDescription>
                        {exam.durationSeconds
                          ? `You have {exam.durationSeconds / 60} minutes to complete
                        this exam.`
                          : "No time limit."}{" "}
                        Make sure you&apos;re in a quiet environment with a
                        stable internet connection.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mb-6 space-y-4">
                      {[
                        {
                          Icon: Clock,
                          label: "Time limit",
                          value: `${
                            exam.durationSeconds
                              ? `${exam.durationSeconds / 60} minutes`
                              : "None"
                          }`,
                        },
                        {
                          Icon: FileText,
                          label: "Questions",
                          value: `${exam.questions.length}`,
                        },
                        {
                          Icon: BarChart,
                          label: "Passing score",
                          value: `${exam.passingScore}%`,
                        },
                      ].map(({ Icon, label, value }) => (
                        <div key={label} className="flex items-center">
                          <Icon size={16} className="text-primary mr-2" />
                          <span className="text-sm">
                            {label}: {value}
                          </span>
                        </div>
                      ))}
                    </div>
                    <DialogFooter>
                      <div className="flex w-full gap-4">
                        <DialogClose asChild>
                          <Button variant="outline" className="flex-1">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          variant="default"
                          className="flex-1"
                          disabled={isPending}
                          onClick={handleStartExamSession}
                        >
                          Begin Exam
                        </Button>
                      </div>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {exam?.existingOngoingSession && (
                <p className="text-muted-foreground mb-6 text-center text-xs">
                  You have an exam in progress from{" "}
                  {formatUTCDate(exam.existingOngoingSession.lastUpdated)}
                </p>
              )}

              <Separator className="my-6" />

              <div className="space-y-4">
                {[
                  {
                    label: "Duration",
                    icon: Clock,
                    value: `${
                      exam.durationSeconds
                        ? `${exam.durationSeconds / 60} minutes`
                        : "No Time Limit"
                    }`,
                  },
                  {
                    label: "Passing Score",
                    value: `${exam.passingScore}%`,
                  },
                  {
                    label: "Difficulty",
                    value: exam.difficulty,
                  },
                  {
                    label: "Retakes",
                    value: "Unlimited",
                  },
                ].map(({ label, icon: Icon, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="flex items-center font-medium">
                      {Icon && (
                        <Icon size={16} className="mr-1 text-gray-400" />
                      )}
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>

            <Separator />

            <CardFooter className="flex flex-col items-start justify-center p-6">
              <CardTitle className="text-sm">This exam includes:</CardTitle>
              <ul className="mt-3 space-y-2">
                {[
                  `${exam.questions.length} assessment questions`,
                  "Downloadable resources",
                  "Full lifetime access",
                  "Completion certificate",
                ].map((item) => (
                  <li key={item} className="flex items-start">
                    <CheckCircle
                      size={16}
                      className="mt-0.5 mr-2 flex-shrink-0 text-green-500"
                    />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
