import ResourceService from "@/lib/services/resource-service";
import { ResourceResponse } from "@/lib/types/resource";
import { useQuery } from "@tanstack/react-query";

const useResourceById = (resourceId: string) => {
  const { data: resource, isLoading } = useQuery<ResourceResponse>({
    queryKey: ["resource", resourceId],
    queryFn: async () => await ResourceService.get(resourceId),
    select: (data) => data,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    resource,
    isLoading,
  };
};
export default useResourceById;
