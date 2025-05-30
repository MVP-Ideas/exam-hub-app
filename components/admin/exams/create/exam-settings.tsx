"use client";

import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, TestTube, TimerIcon } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
} from "@/components/ui/form";
import { ExamFormSchema } from "./exam-form";

const settings = [
  {
    name: "timeLimitEnabled",
    title: "Time Limit Enforcement",
    description: "Enforce time limit for the exam.",
    icon: <TimerIcon />,
  },
  {
    name: "resultsImmediately",
    title: "Show Results Immediately",
    description: "Results will be shown immediately after the exam.",
    icon: <EyeIcon />,
  },
  {
    name: "randomizeQuestions",
    title: "Randomize Questions",
    description: "Questions will be presented in a random order.",
    icon: <TestTube />,
  },
] as const;

type Props = {
  disabled?: boolean;
};

export default function ExamSettings({ disabled = false }: Props) {
  const { control } = useFormContext<ExamFormSchema>();

  return (
    <div
      id="exam-settings"
      className="bg-background border-muted-foreground/20 flex flex-col gap-4 rounded-lg border p-5"
    >
      <h2 className="text-lg font-bold">Exam Settings</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settings.map((setting) => (
          <FormField
            key={setting.name}
            control={control}
            name={`settings.${setting.name}`}
            render={({ field }) => (
              <FormItem className="flex w-full flex-row flex-wrap items-center justify-between gap-4 rounded-lg border p-2">
                <div className="bg-muted rounded-md p-2">{setting.icon}</div>
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
  );
}
