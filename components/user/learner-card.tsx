"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User } from "@/lib/types/user";
import {
  BookOpen,
  Calendar,
  Edit,
  Mail,
  Trash2,
  TrendingUp,
  UserIcon,
} from "lucide-react";

type Props = {
  learner: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

export function LearnerCardHorizontal({ learner, onEdit, onDelete }: Props) {
  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200"
      : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400";
  };

  const formatLastActive = (lastLoginAt: Date | null): string => {
    if (!lastLoginAt) return "Never";
    const date = new Date(lastLoginAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const isActive =
    learner.lastActiveAt !== null &&
    new Date(learner.lastActiveAt) >=
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <Card className="flex w-full flex-row overflow-hidden p-0 transition-shadow hover:shadow-md">
      {/* Colored indicator */}
      <div className={`w-2 ${isActive ? "bg-green-500" : "bg-gray-300"}`} />

      <div className="flex flex-1 flex-col py-2 pl-2">
        <div className="flex flex-col p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <UserIcon className="text-primary h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{learner.name}</h3>
              <div className="text-muted-foreground mt-1 flex items-center text-sm">
                <Mail className="mr-1 h-4 w-4" />
                {learner.email}
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-col space-y-2 md:mt-0 md:flex-row md:items-center md:space-y-0 md:space-x-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(isActive)}`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
            <div className="flex space-x-2">
              <Button
                onClick={() => onEdit(learner)}
                size="sm"
                variant="outline"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                onClick={() => onDelete(learner)}
                size="sm"
                variant="destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 px-4 pb-4">
          <div className="bg-primary/5 flex items-center justify-between rounded-lg p-2">
            <div className="flex items-center gap-2">
              <BookOpen className="text-primary h-4 w-4" />
              <span className="text-sm">Completed:</span>
            </div>
            <span className="text-primary text-sm font-bold">
              {learner.analytics.completedExams || 0}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-purple-50 p-2 dark:bg-purple-900/20">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Avg. Score:</span>
            </div>
            <span className="text-sm font-bold text-purple-600">
              {learner.analytics.averageScore || 0}%
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-green-50 p-2 dark:bg-green-900/20">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="text-sm">Last Active:</span>
            </div>
            <span className="text-sm font-semibold text-green-600">
              {formatLastActive(learner.lastLoginAt)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function LearnerCard({
  learner,
  onEdit,
  onDelete,
}: {
  learner: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}) {
  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200"
      : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400";
  };

  const formatLastActive = (lastLoginAt: Date | null): string => {
    if (!lastLoginAt) return "Never";
    const date = new Date(lastLoginAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const isActive =
    learner.lastLoginAt !== null &&
    new Date(learner.lastLoginAt) >=
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="bg-background border-primary/20 w-full rounded-lg border p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-y-2">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
            <UserIcon className="text-primary h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{learner.name}</h3>
            <div className="text-muted-foreground mt-1 flex items-center text-sm">
              <Mail className="mr-1 h-4 w-4" />
              {learner.email}
            </div>
          </div>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(isActive)}`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="mb-4 grid w-full grid-cols-2 gap-2 md:grid-cols-3">
        <div className="bg-primary/5 flex w-full flex-col justify-between rounded-lg p-3 text-center">
          <div className="mb-1 flex items-center justify-center">
            <BookOpen className="text-primary h-4 w-4" />
          </div>
          <div className="text-primary text-2xl font-bold">
            {learner.analytics.completedExams || 0}
          </div>
          <div className="text-muted-foreground text-xs">Completed</div>
        </div>

        <div className="flex w-full flex-col justify-between rounded-lg bg-purple-50 p-3 text-center dark:bg-purple-900/20">
          <div className="mb-1 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {learner.analytics.averageScore || 0}%
          </div>
          <div className="text-muted-foreground text-xs">Avg. Score</div>
        </div>

        <div className="col-span-2 flex w-full flex-col justify-between rounded-lg bg-green-50 p-3 text-center md:col-span-1 dark:bg-green-900/20">
          <div className="mb-1 flex items-center justify-center">
            <Calendar className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-xl font-semibold text-green-600">
            {formatLastActive(learner.lastLoginAt)}
          </div>
          <div className="text-muted-foreground text-xs">Last Active</div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-primary/10 flex space-x-2 border-t pt-4">
        <Button onClick={() => onEdit(learner)} className="flex-1">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button onClick={() => onDelete(learner)} variant="destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
