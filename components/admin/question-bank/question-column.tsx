import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/lib/types/questions";
import { ColumnDef } from "@tanstack/react-table";
import { Delete, Edit } from "lucide-react";
import { format } from "date-fns";
import QuestionSheet from "./question-sheet";

type Props = {
  onEditQuestion: (question: Question) => void;
  onDeleteQuestion: (question: Question) => void;
};

const questionColumn = ({
  onEditQuestion,
  onDeleteQuestion,
}: Props): ColumnDef<Question>[] => [
  {
    accessorKey: "text",
    header: () => <span className="pl-2">Question</span>,
    cell: ({ row }) => {
      const question = row.original;
      return (
        <div className="max-w-[200px] truncate pl-2 font-medium">
          {question.text}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: () => <span>Type</span>,
    cell: ({ row }) => {
      const question = row.original;

      const typeColorMap: Record<string, string> = {
        MultipleChoiceSingle: "bg-blue-100 text-blue-800 border-blue-200",
        MultipleChoiceMultiple:
          "bg-purple-100 text-purple-800 border-purple-200",
        TrueFalse: "bg-yellow-100 text-yellow-800 border-yellow-200",
        DragAndDrop: "bg-green-100 text-green-800 border-green-200",
      };

      return (
        <Badge
          variant="outline"
          className={`capitalize ${typeColorMap[question.type] ?? "bg-muted text-muted-foreground border-muted"} `}
        >
          {question.type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "category",
    header: () => <span>Category</span>,
    cell: ({ row }) => {
      const question = row.original;

      return (
        <div className="max-w-[100px] truncate pl-2 text-sm font-medium">
          {question.category || "General"}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: () => <span>Last Updated</span>,
    cell: ({ row }) => {
      const question = row.original;
      return <span>{format(new Date(question.updatedAt), "PP")}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <span>Created At</span>,
    cell: ({ row }) => {
      const question = row.original;
      return <span>{format(new Date(question.createdAt), "PP")}</span>;
    },
  },
  {
    id: "usedIn",
    header: () => <span>Used In</span>,
    cell: () => {
      return <span className="text-muted-foreground text-sm">3 exams</span>;
    },
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => {
      const question = row.original;

      return (
        <div className="flex items-center gap-1">
          <QuestionSheet questionId={question.id} />
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => onDeleteQuestion(question)}
          >
            <Delete className="text-destructive" />
          </Button>
        </div>
      );
    },
  },
];

export default questionColumn;
