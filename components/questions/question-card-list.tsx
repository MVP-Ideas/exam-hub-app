"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import QuestionSheet from "@/components/admin/question-bank/question-sheet";
import { Question } from "@/lib/types/questions";
import { cn } from "@/lib/utils";
import { getQuestionTypeBadge } from "@/lib/constants/question";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "date-fns";

type Props = {
  questions: Question[];
  addedQuestionIds?: string[];
  onSelect?: (id: string) => void;
  openQuestionSheet?: (id: string) => void;
};

export default function QuestionCardList({
  questions,
  addedQuestionIds = [],
  onSelect,
}: Props) {
  return (
    <div className="flex flex-col gap-y-4">
      {questions.map((question) => {
        const isAdded = addedQuestionIds.includes(question.id);

        return (
          <QuestionSheet
            key={question.id}
            mode="edit"
            questionId={question.id}
            showClose
          >
            <Card
              className={cn(
                "p-0",
                "hover:border-primary/30 dark:bg-background cursor-pointer transition-all hover:shadow-md",
                onSelect && isAdded && "bg-muted/50 opacity-75",
              )}
            >
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 md:grid md:grid-cols-14 md:items-center">
                  <div className="col-span-3">
                    <h3 className="text-primary line-clamp-2 text-sm font-medium">
                      {question.text}
                    </h3>
                    {question.exams.length > 0 && (
                      <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">
                        Used in {question.exams.length} exam(s)
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    {getQuestionTypeBadge(question.type)}
                  </div>

                  <div
                    className={cn(
                      "col-span-5 flex flex-wrap items-center",
                      !onSelect && "col-span-7",
                    )}
                  >
                    {question.categories && question.categories.length > 0 ? (
                      <div className="flex flex-wrap gap-1 truncate">
                        {question.categories.slice(0, 2).map((category) => (
                          <Badge
                            key={category.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {category.name}
                          </Badge>
                        ))}
                        {question.categories.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{question.categories.length - 2}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        No category
                      </span>
                    )}
                  </div>

                  {/* Created at */}

                  <div className="col-span-2">
                    <p className="text-muted-foreground text-xs font-light">
                      Created on: <br />
                      {formatDate(question.createdAt, "MMM d, yyyy")}
                    </p>
                  </div>

                  {/* Action */}
                  {onSelect && (
                    <div className="col-span-2 flex items-center justify-center">
                      {!isAdded && (
                        <Button
                          variant="default"
                          size="sm"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(question.id);
                          }}
                        >
                          <PlusIcon size={14} className="mr-1" />
                          Add
                        </Button>
                      )}

                      {isAdded && <Badge variant="secondary">Added</Badge>}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </QuestionSheet>
        );
      })}
    </div>
  );
}
