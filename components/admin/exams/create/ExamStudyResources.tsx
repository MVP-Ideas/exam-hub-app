import { Link, UploadIcon } from "lucide-react";
import ExamUploadFileDialog from "./exam-resources/ExamUploadFileDialog";
import ExamAddLinkDialog from "./exam-resources/ExamAddLinkDialog";
import ResourceCard from "../../resources/ResourceCard";
import { ExamFormSchema } from "./ExamForm";
import { useFormContext } from "react-hook-form";

type Props = {
  disabled?: boolean;
};

export default function ExamStudyResources({ disabled = false }: Props) {
  const { setValue, getValues, watch } = useFormContext<ExamFormSchema>();
  const resources = watch("resourceIds") as string[] | undefined;

  const handleDelete = (id: string) => {
    const resources = getValues("resourceIds");

    if (!resources) return;

    const newResources = resources.filter((resource) => resource !== id);
    setValue("resourceIds", newResources);
  };

  return (
    <div
      id="exam-study-resources"
      className="bg-background border-muted-foreground/20 flex w-full flex-col gap-4 rounded-lg border p-5"
    >
      <h2 className="text-lg font-bold">Study Resources</h2>

      <div className="space-y-4 rounded-md border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded bg-gray-100 p-2">
              <UploadIcon size={16} />
            </div>
            <div>
              <h4 className="text-sm font-medium">Upload Study Materials</h4>
              <p className="text-xs text-gray-500">
                Image, PDFs, slides, documents (max 50MB)
              </p>
            </div>
          </div>
          <ExamUploadFileDialog disabled={disabled} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded bg-gray-100 p-2">
              <Link size={16} />
            </div>
            <div>
              <h4 className="text-sm font-medium">Add External Links</h4>
              <p className="text-xs text-gray-500">
                Reference websites, videos, articles
              </p>
            </div>
          </div>
          <ExamAddLinkDialog disabled={disabled} />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        {resources &&
          resources?.length > 0 &&
          resources.map((resource) => (
            <ResourceCard
              resourceId={resource}
              disabled={disabled}
              key={resource}
              handleDelete={() => handleDelete(resource)}
            />
          ))}
      </div>
    </div>
  );
}
