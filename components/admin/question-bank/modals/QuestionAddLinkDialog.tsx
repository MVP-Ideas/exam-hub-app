"use client";

import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { QuestionFormSchema } from "../QuestionSheet";
import useCreateUrlResource from "@/hooks/resources/useCreateUrlResource";
import { CreateUrlResourceRequest } from "@/lib/types/resource";
import AddLinkDialog from "@/components/common/dialogs/AddLinkDialog";

const linkSchema = z.object({
  title: z.string().min(1).max(50),
  url: z.string().url(),
  description: z.string().max(500).optional(),
});

type LinkForm = z.infer<typeof linkSchema>;

export default function QuestionAddLinkDialog() {
  const [open, setOpen] = useState(false);

  const form = useFormContext<QuestionFormSchema>();
  const { createUrlResource, isPending } = useCreateUrlResource();

  const localForm = useForm<LinkForm>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
    },
  });

  const onSubmit = async (data: LinkForm) => {
    if (!data.title || !data.url) return;
    const resourceData: CreateUrlResourceRequest = {
      title: data.title,
      url: data.url,
      description: data.description ?? "",
    };
    const resource = await createUrlResource(resourceData);
    if (!resource) return;

    const prev = form.getValues("resources") ?? [];
    const updated = [...prev, resource];
    form.setValue("resources", updated);

    setOpen(false);
    localForm.reset();
  };

  return (
    <AddLinkDialog<LinkForm>
      open={open}
      setOpen={setOpen}
      form={localForm}
      onSubmit={onSubmit}
      isPending={isPending}
      triggerText="Add Link"
    />
  );
}
