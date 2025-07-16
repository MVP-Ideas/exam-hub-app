"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExamSessionResponse } from "@/lib/types/exam-session";
import ResourceCard from "@/components/admin/resources/resource-card";
import { ScrollArea } from "@/components/ui/scroll-area";

type ExamSessionResourcesModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  examSession: ExamSessionResponse;
};

export default function ExamSessionResourcesModal({
  open,
  onOpenChange,
  examSession,
}: ExamSessionResourcesModalProps) {
  const resources = examSession.exam.resources || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Exam Resources</DialogTitle>
          <DialogDescription>
            Reference materials available for this exam
          </DialogDescription>
        </DialogHeader>

        {resources.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              No resources available for this exam.
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh]">
            <div className="flex flex-col gap-3 py-4">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resourceId={resource.id} />
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
