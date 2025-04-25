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

import { useFormContext } from "react-hook-form";
import ExamCategorySelect from "@/components/categories/exam-category-select";
import { ExamFormSchema } from "./exam-form";
import ExamDifficultySelect from "../exam-difficulty-select";

type Props = {
  disabled: boolean;
};

export default function ExamDetails({ disabled }: Props) {
  const { control } = useFormContext<ExamFormSchema>();

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

      <div className="flex w-full flex-row items-start justify-between gap-4">
        <FormField
          control={control}
          name="categoryId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Category</FormLabel>
              <ExamCategorySelect
                disabled={disabled}
                value={field.value}
                onIdChange={field.onChange}
                includeNull
              />
              <FormMessage />
            </FormItem>
          )}
        />

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
      </div>

      <div className="flex w-full flex-row justify-between gap-4">
        <FormField
          control={control}
          name="timeLimit"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Time Limit (minutes)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={disabled}
                  type="text"
                  placeholder="e.g. 60"
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
    </div>
  );
}
