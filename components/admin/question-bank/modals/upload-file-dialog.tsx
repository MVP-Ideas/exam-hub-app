"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { QuestionFormSchema } from "../question-sheet";
import { ResourceFileCreate } from "@/lib/types/resource";
import useCreateFileResource from "@/hooks/resources/useCreateFileResource";

const fileSchema = z.object({
  title: z.string().min(1, "Title is required").max(50),
  description: z.string().max(500).optional(),
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 50 * 1024 * 1024, "File must be under 50MB"),
});

type FileForm = z.infer<typeof fileSchema>;

export default function UploadFileDialog() {
  const [open, setOpen] = useState(false);

  const form = useFormContext<QuestionFormSchema>();
  const { createFileResource, isPending } = useCreateFileResource();

  const localForm = useForm<FileForm>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,

    formState: { isValid },
  } = localForm;

  const onSubmit = async (data: FileForm) => {
    const resourceData: ResourceFileCreate = {
      title: data.title,
      description: data.description ?? "",
      file: data.file,
    };

    const resource = await createFileResource(resourceData);
    if (!resource?.id) return;

    const prev = form.getValues("resources") ?? [];
    form.setValue("resources", [...prev, resource.id]);

    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" type="button">
          Upload
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Study Materials</DialogTitle>
          <DialogDescription>
            Image, PDFs, slides, documents (max 50MB)
          </DialogDescription>
        </DialogHeader>

        <Form {...localForm}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="title"
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
              name="file"
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
              name="description"
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
                onClick={handleSubmit(onSubmit)}
                type="button"
                disabled={!isValid || isPending}
              >
                Upload
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
