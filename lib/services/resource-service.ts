import api from "@/lib/axios";
import { isProblemDetails } from "@/lib/utils";
import {
  ResourceResponse,
  CreateUrlResourceRequest,
  CreateFileResourceRequest,
} from "@/lib/types/resource";

const BASE_URL = "resources";

const ResourceService = {
  // For uploading a file resource
  upload: async (request: CreateFileResourceRequest) => {
    const formData = new FormData();
    formData.append("file", request.file);
    for (const [key, value] of Object.entries(request)) {
      formData.append(key, value);
    }

    const response = await api.post<ResourceResponse>(
      `${BASE_URL}/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    if (isProblemDetails(response.data)) throw response.data;
    return response.data;
  },

  // For creating a URL-based resource
  addLink: async (request: CreateUrlResourceRequest) => {
    const response = await api.post<ResourceResponse>(`${BASE_URL}`, request);
    if (isProblemDetails(response.data)) throw response.data;
    return response.data;
  },

  get: async (resourceId: string) => {
    const response = await api.get<ResourceResponse>(
      `${BASE_URL}/${resourceId}`,
    );
    if (isProblemDetails(response.data)) throw response.data;
    return response.data;
  },
};

export default ResourceService;
