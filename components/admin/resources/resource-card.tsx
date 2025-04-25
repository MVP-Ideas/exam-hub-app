import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useResourceById from "@/hooks/resources/useResourceById";
import { Link, TrashIcon, UploadIcon } from "lucide-react";
import NextLink from "next/link";
import { useFormContext } from "react-hook-form";
import { QuestionFormSchema } from "../question-bank/question-sheet";

type Props = {
  resourceId: string;
  disabled?: boolean;
};

export default function ResourceCard({ resourceId, disabled = false }: Props) {
  const form = useFormContext<QuestionFormSchema>();
  const { resource, isLoading } = useResourceById(resourceId);

  const handleDelete = () => {
    const resources = form.getValues("resources");

    if (!resources) return;

    const newResources = resources.filter((id) => id !== resourceId);
    form.setValue("resources", newResources);
  };

  if (isLoading || !resource) {
    return (
      <Card className="w-full p-4">
        <CardContent className="p-0">
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full p-4">
      <CardContent className="flex flex-row items-center justify-between p-0">
        <NextLink href={resource.value} target="_blank">
          <div className="flex flex-row items-center gap-4">
            {resource.type.toLowerCase() === "file" && (
              <div className="rounded bg-gray-100 p-2">
                <UploadIcon size={16} />
              </div>
            )}
            {resource.type.toLowerCase() === "url" && (
              <div className="rounded bg-gray-100 p-2">
                <Link size={16} />
              </div>
            )}

            <div className="flex flex-col">
              <p className="text-sm font-semibold">{resource.title}</p>
              <p className="text-muted-foreground text-xs">
                {resource.description}
              </p>
            </div>
          </div>
        </NextLink>

        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={disabled}
        >
          <TrashIcon size={16} />
          <span>Delete</span>
        </Button>
      </CardContent>
    </Card>
  );
}
