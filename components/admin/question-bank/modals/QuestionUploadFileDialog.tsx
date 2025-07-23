"use client";

import { useState } from "react";
import { useFormContext, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { QuestionFormSchema } from "../QuestionSheet";
import { CreateFileResourceRequest } from "@/lib/types/resource";
import useCreateFileResource from "@/hooks/resources/useCreateFileResource";
import UploadFileDialog from "@/components/common/dialogs/UploadFileDialog";

const fileSchema = z.object({
  title: z.string().min(1, "Title is required").max(50),
  description: z.string().max(500).optional(),
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 50 * 1024 * 1024, "File must be under 50MB"),
});

type FileForm = z.infer<typeof fileSchema>;

export default function QuestionUploadFileDialog() {
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

  const onSubmit = async (data: FileForm) => {
    const resourceData: CreateFileResourceRequest = {
      title: data.title,
      description: data.description ?? "",
      file: data.file,
    };

    const resource = await createFileResource(resourceData);
    if (!resource) return;

    const prev = form.getValues("resources") ?? [];
    form.setValue("resources", [...prev, resource]);

    setOpen(false);
    localForm.reset();
  };

  return (
    <UploadFileDialog<FileForm>
      open={open}
      setOpen={setOpen}
      form={localForm}
      onSubmit={onSubmit}
      isPending={isPending}
      triggerText="Upload"
    />
  );
}
