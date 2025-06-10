"use client";

import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  EyeIcon,
  TestTube,
  FileText,
  HelpCircle,
  BookOpen,
  PencilLine,
  Sparkles,
  Lightbulb,
  Calculator,
} from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
} from "@/components/ui/form";
import { ExamFormSchema } from "./exam-form";

// Group types
type SettingGroup = {
  name: string;
  settings: Setting[];
};

type Setting = {
  name: keyof ExamFormSchema["settings"];
  title: string;
  description: string;
  icon: React.ReactNode;
};

// Settings grouped by functionality
const settingGroups: SettingGroup[] = [
  {
    name: "Exam Format",
    settings: [
      {
        name: "randomizeQuestions",
        title: "Randomize Questions",
        description: "Questions will be presented in a random order.",
        icon: <TestTube />,
      },
      {
        name: "showQuestionPoints",
        title: "Show Question Points",
        description: "Display point values for each question during the exam.",
        icon: <PencilLine />,
      },
      {
        name: "showCalculator",
        title: "Show Calculator",
        description: "Provide a calculator tool for learners during the exam.",
        icon: <Calculator />,
      },
    ],
  },
  {
    name: "Results & Feedback",
    settings: [
      {
        name: "resultsImmediately",
        title: "Show Results Immediately",
        description: "Results will be shown immediately after the exam.",
        icon: <EyeIcon />,
      },
      {
        name: "showQuestionExplanations",
        title: "Show Explanations",
        description: "Display explanations for questions after answering.",
        icon: <HelpCircle />,
      },
    ],
  },
  {
    name: "Resources",
    settings: [
      {
        name: "showExamResourcesDuringSession",
        title: "Show Exam Resources",
        description: "Allow access to exam resources during the session.",
        icon: <FileText />,
      },
      {
        name: "showQuestionResourcesDuringSession",
        title: "Show Question Resources",
        description:
          "Show attached resources for each question during the exam.",
        icon: <BookOpen />,
      },
    ],
  },

  {
    name: "AI Features",
    settings: [
      {
        name: "enableAiPoweredExplanations",
        title: "AI Explanations",
        description: "Enable AI-powered explanations for complex questions.",
        icon: <Sparkles />,
      },
      {
        name: "enableAiRewriteQuestions",
        title: "AI Question Rewriting",
        description: "Allow AI to rewrite questions for better clarity.",
        icon: <PencilLine />,
      },
      {
        name: "enableHints",
        title: "Enable Hints",
        description: "Allow learners to request hints during the exam.",
        icon: <Lightbulb />,
      },
    ],
  },
];

type Props = {
  disabled?: boolean;
};

export default function ExamSettings({ disabled = false }: Props) {
  const { control } = useFormContext<ExamFormSchema>();

  return (
    <div
      id="exam-settings"
      className="bg-background border-muted-foreground/20 flex flex-col gap-6 rounded-lg border p-5"
    >
      <h2 className="text-lg font-bold">Exam Settings</h2>

      {settingGroups.map((group) => (
        <div key={group.name} className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-medium">{group.name}</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {group.settings.map((setting) => (
                <FormField
                  key={setting.name}
                  control={control}
                  name={`settings.${setting.name}`}
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-row flex-wrap items-center justify-between gap-4 rounded-lg border p-2">
                      <div className="bg-muted rounded-md p-2">
                        {setting.icon}
                      </div>
                      <div className="flex flex-1 flex-col items-start">
                        <FormLabel className="text-sm font-bold">
                          {setting.title}
                        </FormLabel>
                        <FormDescription className="text-muted-foreground text-xs">
                          {setting.description}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          disabled={disabled}
                          className="bg-muted"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
