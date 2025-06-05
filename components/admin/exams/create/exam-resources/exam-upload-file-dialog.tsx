"use client";

import { useState } from "react";
import { useFormContext, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ResourceFileCreate } from "@/lib/types/resource";
import useCreateFileResource from "@/hooks/resources/useCreateFileResource";
import UploadFileDialog from "@/components/common/dialogs/upload-file-dialog";
import { ExamFormSchema } from "../exam-form";

const fileSchema = z.object({
  title: z.string().min(1, "Title is required").max(50),
  description: z.string().max(500).optional(),
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 50 * 1024 * 1024, "File must be under 50MB"),
});

type FileForm = z.infer<typeof fileSchema>;

type Props = {
  disabled?: boolean;
};

export default function ExamUploadFileDialog({ disabled = false }: Props) {
  const [open, setOpen] = useState(false);

  const form = useFormContext<ExamFormSchema>();
  const { createFileResource, isPending } = useCreateFileResource();

  const localForm = useForm<FileForm>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: FileForm) => {
    try {
      const resourceData: ResourceFileCreate = {
        title: data.title,
        description: data.description !== undefined ? data.description : "",
        file: data.file,
      };

      const resource = await createFileResource(resourceData);
      if (!resource) return;

      const prev = form.getValues("resourceIds") ?? [];
      form.setValue("resourceIds", [...prev, resource.id]);

      setOpen(false);
      localForm.reset();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <UploadFileDialog<FileForm>
      disabled={disabled}
      open={open}
      setOpen={setOpen}
      form={localForm}
      onSubmit={onSubmit}
      isPending={isPending}
      triggerText="Upload"
    />
  );
}
