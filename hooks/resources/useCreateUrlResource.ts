import ResourceService from "@/lib/services/resource-service";
import { CreateUrlResourceRequest } from "@/lib/types/resource";
import { extractAxiosErrorMessage } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const createUrlResourceRequest = async (data: CreateUrlResourceRequest) => {
  try {
    const response = await ResourceService.addLink(data);
    if (response) {
      return response;
    }
    throw new Error("Failed to create file resource");
  } catch (error) {
    throw error;
  }
};

const useCreateUrlResource = () => {
  const { mutateAsync: createUrlResource, isPending } = useMutation({
    mutationFn: (data: CreateUrlResourceRequest) =>
      createUrlResourceRequest(data),
    onSuccess: () => {
      toast.success("Link resource created successfully");
    },
    onError: (error) => {
      const message = extractAxiosErrorMessage(error);
      toast.error(message);
      throw new Error(message);
    },
  });
  return { createUrlResource, isPending };
};

export default useCreateUrlResource;
