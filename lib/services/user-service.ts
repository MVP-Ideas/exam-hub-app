import api from "@/lib/axios";
import { isProblemDetails } from "@/lib/utils";
import { PaginationResponse } from "@/lib/types/pagination";
import { User, UserUpdate } from "@/lib/types/user";

const BASE_URL = "users";

type SearchParams = {
  search: string;
  page: number;
  pageSize: number;
  role: string;
};

const UserService = {
  getCurrentUser: async () => {
    const response = await api.get<User>(`${BASE_URL}/me`);
    if (isProblemDetails(response.data)) throw response.data;
    return response.data;
  },
  getLearners: async (params: SearchParams) => {
    const response = await api.get<PaginationResponse<User>>(`${BASE_URL}`, {
      params: {
        search: params.search,
        page: params.page,
        pageSize: params.pageSize,
        role: params.role,
      },
    });
    if (isProblemDetails(response.data)) throw response.data;
    return response.data;
  },
  update: async (id: string, user: UserUpdate) => {
    const response = await api.put<User>(`${BASE_URL}/${id}`, user);
    if (isProblemDetails(response.data)) throw response.data;
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<boolean>(`${BASE_URL}/${id}`);
    if (isProblemDetails(response.data)) throw response.data;
    return response.data;
  },
};

export default UserService;
