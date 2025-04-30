"use client";

import { useParams } from "next/navigation";
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
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
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
import { DialogClose } from "@radix-ui/react-dialog";
import { formatUTCDate } from "@/lib/date-utils";

export default function Page() {
  const { id } = useParams();
  const { exam, isLoading, isError } = useExamById(id as string);
  const resources = exam?.resources || [];

  if (isLoading || isError || !exam) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Skeleton className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="bg-accent h-full min-h-screen pb-20 md:pb-10">
      {/* Hero */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-r from-indigo-700 to-purple-900">
        <div className="absolute inset-0 bg-black opacity-30" />
        <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
          <div className="mb-2 flex space-x-2 text-sm">
            <Badge variant="secondary" className="bg-indigo-600">
              {exam.category}
            </Badge>
            <Badge variant="secondary" className="bg-purple-600">
              {exam.difficulty}
            </Badge>
          </div>
          <h1 className="mb-2 text-3xl font-bold">{exam.title}</h1>
          <div className="flex items-center space-x-4 text-sm">
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
                <h3 className="mb-4 text-lg font-medium">What You’ll Learn</h3>
                <ul className="space-y-3">
                  {[
                    `Demonstrate your knowledge in ${exam.category}`,
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
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    {
                      Icon: Clock3,
                      label: "Time Limit",
                      value: `${exam.durationSeconds / 60} minutes`,
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
                    {
                      Icon: BookOpen,
                      label: "Category",
                      value: exam.category,
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
              </CardContent>
            </Card>

            {/* Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Study Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resources && resources.length > 0 ? (
                  resources.map((resource) => (
                    <ResourceCard resource={resource} key={resource.id} />
                  ))
                ) : (
                  <div className="bg-muted flex h-full w-full flex-1 flex-col items-center justify-center gap-4 rounded-lg p-10">
                    <FileQuestion size={48} className="text-muted-foreground" />
                    <p className="text-muted-foreground font-bold">
                      No resources found.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mb-6 w-full">Start Exam</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ready to start the exam?</DialogTitle>
                    <DialogDescription>
                      You have {exam.durationSeconds / 60} minutes to complete
                      this exam. Make sure you’re in a quiet environment with a
                      stable internet connection.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mb-6 space-y-4">
                    {[
                      {
                        Icon: Clock,
                        label: "Time limit",
                        value: `${exam.durationSeconds / 60} minutes`,
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
                      <Button variant="secondary" className="flex-1">
                        Begin Exam
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Separator className="my-6" />

              <div className="space-y-4">
                {[
                  {
                    label: "Duration",
                    icon: Clock,
                    value: `${exam.durationSeconds / 60} minutes`,
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
