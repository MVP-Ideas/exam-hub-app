"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, PlusIcon, TagIcon } from "lucide-react";
import QuestionSheet from "@/components/admin/question-bank/question-sheet";
import { Question } from "@/lib/types/questions";
import { cn } from "@/lib/utils";
import { getQuestionTypeBadge } from "@/lib/constants/question";
import { Card, CardContent } from "@/components/ui/card";

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
    <>
      {questions.map((question) => {
        const isAdded = addedQuestionIds.includes(question.id);

        return (
          <Card
            key={question.id}
            className={cn(
              "bg-white p-4 transition-shadow hover:shadow-md",
              onSelect && isAdded && "bg-muted opacity-75",
            )}
          >
            <CardContent className="p-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-x-2">
                    <h3 className="text-primary text-sm font-medium">
                      {question.text}
                    </h3>
                    {getQuestionTypeBadge(question.type)}
                  </div>

                  <div className="text-muted-foreground mt-1 flex items-center gap-x-4 text-sm">
                    <p className="text-muted-foreground truncate text-xs">
                      {question.description}
                    </p>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {question.categories && question.categories.length > 0 ? (
                      question.categories.map((category) => (
                        <Badge
                          key={category.id}
                          variant="outline"
                          className="text-xs"
                        >
                          <TagIcon size={12} className="mr-1 shrink-0" />
                          {category.name}
                        </Badge>
                      ))
                    ) : (
                      <div className="flex items-center">
                        <TagIcon size={12} className="mr-1 shrink-0" />
                        <span className="text-muted-foreground text-xs">
                          No category
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <QuestionSheet mode="edit" questionId={question.id} showClose>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </QuestionSheet>

                  {onSelect && !isAdded && (
                    <Button
                      variant="default"
                      size="icon"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(question.id);
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
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
