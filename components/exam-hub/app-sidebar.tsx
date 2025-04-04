"use client";

import {
  CalculatorIcon,
  ChevronRight,
  CircleCheckBig,
  CircleHelp,
  NotebookPen,
  PauseCircle,
  Sun,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Question } from "@/lib/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

import { useQuestionStore } from "@/stores/question-store";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type Props = {
  questions: Question[];
  handleChangeQuestion: (order: number) => void;
};

export function AppSidebar({ questions, handleChangeQuestion }: Props) {
  const { setTheme } = useTheme();
  const { startBreak, isOnBreak, stopBreak } = useQuestionStore();

  const handleToggleBreak = () => {
    if (isOnBreak) {
      stopBreak();
    } else {
      startBreak();
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-row items-center justify-between px-2">
            <h1 className="font-bold">Exam Toolbar</h1>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Exam Navigation */}
        <Collapsible
          key={"ExamQuestionDetails"}
          title={"Exam Question Details"}
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
            >
              <CollapsibleTrigger>
                <div className="flex flex-row items-center gap-x-2">
                  <NotebookPen />
                  <h2>Exam Question Details</h2>
                </div>

                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {questions.map((item) => (
                    <SidebarMenuSub key={"question" + item.order}>
                      <SidebarMenuItem key={"question" + item.order}>
                        <h2>{"Question " + item.order}</h2>
                      </SidebarMenuItem>
                    </SidebarMenuSub>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Exam Progress */}
        <Collapsible
          key={"ExamProgress"}
          title={"Exam Progress"}
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
            >
              <CollapsibleTrigger>
                <div className="flex flex-row items-center gap-x-2">
                  <CircleCheckBig />
                  <h2>Exam Progress</h2>
                </div>

                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {questions.map((item) => (
                    <SidebarMenuSub key={"question-progress" + item.order}>
                      <SidebarMenuItem key={"question-progress" + item.order}>
                        <SidebarMenuSubButton
                          onClick={() => handleChangeQuestion(item.order - 1)}
                          className={cn(
                            "flex cursor-pointer flex-row items-center justify-between",
                            `${!item.isAnswered ? "bg-destructive/60 text-background" : "bg-primary text-primary-foreground"}`,
                          )}
                        >
                          <h2>{"Question " + item.order}</h2>
                          {item.reviewLater && (
                            <span className="text-accent text-xs">Review</span>
                          )}
                        </SidebarMenuSubButton>
                      </SidebarMenuItem>
                    </SidebarMenuSub>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Separator */}
        <div className="flex flex-col items-center">
          <div className="border-muted-foreground/70 w-[95%] border border-b" />
        </div>

        {/* Break */}
        <SidebarMenu className="p-2">
          <SidebarMenuButton
            onClick={handleToggleBreak}
            className="cursor-pointer"
          >
            <SidebarMenuItem className="flex flex-row items-center gap-x-2">
              <PauseCircle />
              <h2 className="font-bold">
                {isOnBreak ? "End Break" : "Take a Break"}
              </h2>
            </SidebarMenuItem>
          </SidebarMenuButton>
        </SidebarMenu>

        {/* Calculator */}
        <SidebarMenu className="p-2">
          <SidebarMenuButton>
            <SidebarMenuItem className="flex flex-row items-center gap-x-2">
              <CalculatorIcon />
              <h2 className="font-bold">Calculator</h2>
            </SidebarMenuItem>
          </SidebarMenuButton>
        </SidebarMenu>

        {/* Color Scheme */}
        <Collapsible
          key={"colorScheme"}
          title={"Color Scheme"}
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
            >
              <CollapsibleTrigger>
                <div className="flex flex-row items-center gap-x-2">
                  <Sun />
                  <h2 className="font-bold">Color Scheme</h2>
                </div>

                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuSub>
                    <SidebarMenuSubButton
                      onClick={() => setTheme("light")}
                      className="cursor-pointer"
                    >
                      <SidebarMenuSubItem>
                        <h2>Light</h2>
                      </SidebarMenuSubItem>
                    </SidebarMenuSubButton>
                    <SidebarMenuSubButton
                      onClick={() => setTheme("dark")}
                      className="cursor-pointer"
                    >
                      <SidebarMenuSubItem>
                        <h2>Dark</h2>
                      </SidebarMenuSubItem>
                    </SidebarMenuSubButton>
                  </SidebarMenuSub>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Help */}
        <SidebarMenu className="p-2">
          <SidebarMenuButton>
            <SidebarMenuItem className="flex flex-row items-center gap-x-2">
              <CircleHelp />
              <h2 className="font-bold">Help</h2>
            </SidebarMenuItem>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
