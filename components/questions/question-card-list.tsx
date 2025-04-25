"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, PlusIcon, TagIcon } from "lucide-react";
import QuestionSheet from "@/components/admin/question-bank/question-sheet";
import { Question } from "@/lib/types/questions";
import { cn } from "@/lib/utils";
import { getQuestionTypeBadge } from "@/lib/constants/question";

type Props = {
  questions: Question[];
  addedQuestionIds?: string[];
  onSelect?: (id: string) => void;
};

export default function QuestionCardList({
  questions,
  addedQuestionIds = [],
  onSelect,
}: Props) {
  return (
    <>
      {questions.map((q) => {
        const isAdded = addedQuestionIds.includes(q.id);

        return (
          <div
            key={q.id}
            className={cn(
              "hover:bg-accent flex-flex-col gap-2 rounded-lg border bg-white p-4 transition md:grid md:grid-cols-[2fr_2fr_1fr_1fr] md:items-center md:gap-4",
              onSelect && isAdded && "bg-muted opacity-75",
            )}
          >
            {/* Question text + description */}
            <div className="flex flex-col overflow-hidden">
              <p className="text-primary truncate text-sm font-bold">
                {q.text}
              </p>
              <p className="text-muted-foreground truncate text-xs">
                {q.description}
              </p>
            </div>

            {/* Type */}
            <div className="text-muted-foreground truncate text-xs">
              {getQuestionTypeBadge(q.type)}
            </div>

            {/* Category */}
            <div className="flex flex-row items-center gap-2">
              <TagIcon size={12} className="shrink-0" />
              <p className="text-muted-foreground text-xs">
                {q.category || "No category"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
              <QuestionSheet mode="edit" questionId={q.id} showClose>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Eye className="text-muted-foreground" size={16} />
                </Button>
              </QuestionSheet>

              {onSelect && !isAdded && (
                <Button
                  variant="default"
                  size="icon"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(q.id);
                  }}
                  className="rounded-full"
                >
                  <PlusIcon className="text-background" size={16} />
                </Button>
              )}

              {onSelect && isAdded && (
                <Badge className="bg-muted text-muted-foreground">
                  <p>Added</p>
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
