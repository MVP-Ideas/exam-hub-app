"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";

import { useFormContext } from "react-hook-form";
import ExamCategoryMultiselect from "@/components/categories/exam-category-multiselect";
import { ExamFormSchema } from "./exam-form";
import ExamDifficultySelect from "../exam-difficulty-select";
import { useState, useEffect } from "react";

type Props = {
  disabled: boolean;
};

export default function ExamDetails({ disabled }: Props) {
  const { control, watch, setValue } = useFormContext<ExamFormSchema>();
  const timeLimit = watch("timeLimit");
  const [timeLimitEnabled, setTimeLimitEnabled] = useState(timeLimit !== null);

  // Sync the switch state with the form value when form changes (e.g., during edit)
  useEffect(() => {
    setTimeLimitEnabled(timeLimit !== null);
  }, [timeLimit]);

  return (
    <div
      id="exam-details"
      className="bg-background border-muted-foreground/20 flex flex-col gap-4 rounded-lg border p-5"
    >
      <h2 className="text-lg font-bold">Exam Details</h2>

      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Exam Title</FormLabel>

            <FormControl>
              <Input
                disabled={disabled}
                placeholder="Enter Exam Title"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                disabled={disabled}
                className="h-40 resize-none"
                placeholder="Enter Description"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="w-full space-y-3">
        <div className="flex flex-row items-center justify-between rounded-lg border p-2">
          <div className="space-y-0.5">
            <FormLabel className="text-sm">Enable Time Limit</FormLabel>
            <div className="text-muted-foreground text-xs">
              Set a time limit for this exam
            </div>
          </div>
          <Switch
            disabled={disabled}
            checked={timeLimitEnabled}
            onCheckedChange={(checked) => {
              setTimeLimitEnabled(checked);
              if (!checked) {
                setValue("timeLimit", null);
              } else {
                setValue("timeLimit", 60); // Default to 60 minutes
              }
            }}
          />
        </div>

        <AnimatePresence>
          {timeLimitEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <FormField
                control={control}
                name="timeLimit"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Time Limit (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabled || !timeLimitEnabled}
                        type="text"
                        placeholder={
                          timeLimitEnabled
                            ? "e.g. 60"
                            : "Enable time limit to set duration"
                        }
                        value={timeLimitEnabled ? field.value || "" : ""}
                        onChange={(e) => {
                          if (!timeLimitEnabled) return;

                          // Check if number
                          if (isNaN(Number(e.target.value))) {
                            return;
                          }

                          field.onChange(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex w-full flex-row items-start justify-between gap-4">
        <FormField
          control={control}
          name="difficulty"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Difficulty</FormLabel>
              <FormControl>
                <ExamDifficultySelect
                  disabled={disabled}
                  value={field.value}
                  onChange={field.onChange}
                  includeNull={false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="passingScore"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Passing Score (%)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={disabled}
                  type="number"
                  placeholder="e.g. 70"
                  onChange={(e) => {
                    // Check if number

                    if (isNaN(Number(e.target.value))) {
                      return;
                    }

                    field.onChange(
                      e.target.value === "" ? "" : Number(e.target.value),
                    );
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="categoryIds"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Categories</FormLabel>
            <ExamCategoryMultiselect
              disabled={disabled}
              value={field.value || []}
              onChange={field.onChange}
            />
          </FormItem>
        )}
      />
    </div>
  );
}
