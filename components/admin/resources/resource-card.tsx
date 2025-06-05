import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, TrashIcon, UploadIcon } from "lucide-react";
import NextLink from "next/link";
import useResourceById from "@/hooks/resources/useResourceById";

type Props = {
  resourceId: string;
  disabled?: boolean;
  handleDelete?: (id: string) => void;
};

export default function ResourceCard({
  resourceId,
  handleDelete,
  disabled = false,
}: Props) {
  const { resource } = useResourceById(resourceId);

  if (!resource) {
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
              <div className="bg-muted rounded p-2">
                <UploadIcon size={16} className="text-primary" />
              </div>
            )}
            {resource.type.toLowerCase() === "url" && (
              <div className="bg-muted rounded p-2">
                <Link size={16} className="text-primary" />
              </div>
            )}

            <div className="flex flex-col">
              <p className="text-sm font-semibold">{resource.title}</p>
              <p className="text-muted-foreground text-xs">
                {resource.description || resource.value}
              </p>
            </div>
          </div>
        </NextLink>

        <NextLink
          hidden={!!handleDelete}
          href={resource.value}
          target="_blank"
          className="text-muted-foreground hover:text-primary"
        >
          <div className="text-primary rounded-lg p-2 font-bold">
            <p className="text-sm">Open</p>
          </div>
        </NextLink>

        <Button
          hidden={!handleDelete}
          variant="destructive"
          onClick={() => handleDelete?.(resource.id)}
          disabled={disabled}
        >
          <TrashIcon size={16} />
        </Button>
      </CardContent>
    </Card>
  );
}
