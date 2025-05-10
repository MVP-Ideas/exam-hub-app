import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ExamSessionAnswer } from "@/lib/types/exam-session";
import {
  ArrowLeftToLine,
  BookIcon,
  CalculatorIcon,
  FileQuestion,
} from "lucide-react";

type Props = {
  answers: ExamSessionAnswer[];
};

export default function ExamSessionToolbar({ answers }: Props) {
  const temporaryArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <Sidebar
      variant="sidebar"
      className="bg-muted/40 flex flex-col gap-y-2 p-2"
    >
      <SidebarHeader className="bg-muted mb-2 flex items-start gap-y-1 rounded-lg p-4">
        <p className="text-sm font-bold">Question 1</p>
        <p className="text-primary text-xs font-bold">1 point</p>
      </SidebarHeader>

      <SidebarContent className="bg-background rounded-lg p-4">
        <div className="flex flex-col gap-y-2">
          <p className="text-primary text-sm font-semibold">Item Navigation</p>
          <div className="grid grid-cols-6 gap-2">
            {temporaryArray.map((item) => (
              <div
                key={item}
                className="bg-background text-foreground flex h-8 w-8 items-center justify-center rounded-sm border text-sm font-semibold"
              >
                {item}
              </div>
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
        <Button variant="destructive" className="w-full font-bold">
          <ArrowLeftToLine />
          Exit Exam
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
