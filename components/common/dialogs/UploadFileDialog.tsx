"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  open: boolean;
  setOpen: (open: boolean) => void;
  form: UseFormReturn<T>;
  onSubmit: (values: T) => Promise<void>;
  isPending?: boolean;
  triggerText?: string;
  disabled?: boolean;
};

export default function UploadFileDialog<T extends FieldValues>({
  open,
  setOpen,
  form,
  onSubmit,
  disabled = false,
  isPending = false,
  triggerText = "Upload",
}: Props<T>) {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = form;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" type="button" disabled={disabled}>
          {triggerText}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Study Materials</DialogTitle>
          <DialogDescription>
            Image, PDFs, slides, documents (max 50MB)
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={control}
              name={"title" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Week 2 Slides" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={"file" as Path<T>}
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={"description" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. Lecture notes on subject..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="button"
                disabled={!isValid || isPending}
                onClick={handleSubmit(onSubmit)}
              >
                {triggerText}
              </Button>
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
