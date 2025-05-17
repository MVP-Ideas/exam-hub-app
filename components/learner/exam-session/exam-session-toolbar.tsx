import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ExamQuestionCreateReadUpdate } from "../../../lib/types/exam";
import {
  ArrowLeftToLine,
  BookIcon,
  CalculatorIcon,
  FileQuestion,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  examId: string;
  questions: ExamQuestionCreateReadUpdate[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
};

export default function ExamSessionToolbar({
  examId,
  questions,
  currentQuestionIndex,
  setCurrentQuestionIndex,
}: Props) {
  const router = useRouter();

  return (
    <Sidebar
      variant="sidebar"
      className="bg-muted/40 flex flex-col gap-y-2 p-2"
    >
      <SidebarHeader className="bg-muted mb-2 flex items-start gap-y-1 rounded-lg p-4">
        <p className="text-sm font-bold">Question {currentQuestionIndex + 1}</p>
        <p className="text-primary text-xs font-bold">
          {questions[currentQuestionIndex].points} point
          {questions[currentQuestionIndex].points > 1 ? "s" : ""}
        </p>
      </SidebarHeader>

      <SidebarContent className="bg-background rounded-lg p-4">
        <div className="flex flex-col gap-y-2">
          <p className="text-primary text-sm font-semibold">Item Navigation</p>
          <div className="grid grid-cols-6 gap-2">
            {questions.map((_, index) => (
              <Button
                key={index}
                variant={index === currentQuestionIndex ? "default" : "outline"}
                className={`h-8 w-8 p-0 text-sm font-semibold`}
                onClick={() => setCurrentQuestionIndex(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
          <Separator className="my-2" />
          <div className="flex flex-col gap-y-2">
            <p className="text-primary text-sm font-semibold">Exam Tools</p>
            <div className="flex flex-col gap-y-2">
              <Button variant="outline" className="w-full font-semibold">
                <CalculatorIcon className="h-4 w-4" />
                Calculator
              </Button>
              <Button variant="outline" className="w-full font-semibold">
                <BookIcon className="h-4 w-4" />
                Resources
              </Button>
              <Button variant="outline" className="w-full font-semibold">
                <FileQuestion className="h-4 w-4" />
                Help
              </Button>
            </div>
          </div>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="destructive"
          className="w-full font-bold"
          onClick={() => {
            router.push(`/exams/${examId}`);
          }}
        >
          <ArrowLeftToLine />
          Exit Exam
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
