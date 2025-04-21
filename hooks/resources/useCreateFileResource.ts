import ResourceService from "@/lib/services/resource-service";
import { ResourceFileCreate } from "@/lib/types/resource";
import { extractAxiosErrorMessage } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const createFileResourceRequest = async (data: ResourceFileCreate) => {
  try {
    const response = await ResourceService.upload(data);
    if (response) {
      return response;
    }
    throw new Error("Failed to create file resource");
  } catch (error) {
    throw error;
  }
};

const useCreateFileResource = () => {
  const { mutateAsync: createFileResource, isPending } = useMutation({
    mutationFn: (data: ResourceFileCreate) => createFileResourceRequest(data),
    onSuccess: () => {
      toast.success("File resource created successfully");
    },
    onError: (error) => {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
      throw new Error(message);
    },
  });
  return { createFileResource, isPending };
};

export default useCreateFileResource;
