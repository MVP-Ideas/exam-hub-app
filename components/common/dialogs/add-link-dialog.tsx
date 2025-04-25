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
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldValues, Form, Path, UseFormReturn } from "react-hook-form";

type Props<T extends FieldValues> = {
  open: boolean;
  setOpen: (open: boolean) => void;
  form: UseFormReturn<T>;
  onSubmit: (values: T) => Promise<void>;
  isPending?: boolean;
  triggerText?: string;
  disabled?: boolean;
};

export default function AddLinkDialog<T extends FieldValues>({
  open,
  setOpen,
  form,
  onSubmit,
  disabled = false,
  isPending = false,
  triggerText = "Add Link",
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

        <Form>
          <div className="space-y-4">
            <FormField
              control={control}
              name={"title" as Path<T>}
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
              control={control}
              name={"url" as Path<T>}
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
              control={control}
              name={"description" as Path<T>}
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
                {triggerText}
              </Button>
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
