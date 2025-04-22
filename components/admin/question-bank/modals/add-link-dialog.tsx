"use client";

import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { QuestionFormSchema } from "../question-sheet";
import useCreateUrlResource from "@/hooks/resources/useCreateUrlResource";
import { ResourceUrlCreate } from "@/lib/types/resource";

const linkSchema = z.object({
  title: z.string().min(1).max(50),
  url: z.string().url(),
  description: z.string().max(500).optional(),
});

type LinkForm = z.infer<typeof linkSchema>;

export default function AddLinkDialog() {
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

  const {
    control: localControl,
    handleSubmit,
    reset,
    formState: { isValid },
  } = localForm;

  const onSubmit = async (data: LinkForm) => {
    if (!data.title || !data.url) return;
    const resourceData: ResourceUrlCreate = {
      title: data.title,
      url: data.url,
      description: data.description ?? "",
    };
    const resource = await createUrlResource(resourceData);
    if (!resource?.id) return;

    const prev = form.getValues("resources") ?? [];
    const updated = [...prev, resource.id];
    form.setValue("resources", updated);

    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" type="button">
          Add link
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add External Link</DialogTitle>
          <DialogDescription>
            Reference websites, videos, articles
          </DialogDescription>
        </DialogHeader>

        <Form {...localForm}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={localControl}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. React Docs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={localControl}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={localControl}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional notes for this resource"
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
                Add Link
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
