import api from "@/lib/axios";
import { PaginationResponse } from "@/lib/types/pagination";
import { UserResponse, UpdateUserRequest } from "@/lib/types/user";

const BASE_URL = "users";

type SearchParams = {
  search: string;
  page: number;
  pageSize: number;
  role: string;
};

const UserService = {
  getCurrentUser: async () => {
    const response = await api.get<UserResponse>(`${BASE_URL}/me`);
    return response.data;
  },
  getUsers: async (params: SearchParams) => {
    const response = await api.get<PaginationResponse<UserResponse>>(
      `${BASE_URL}`,
      {
        params: {
          search: params.search,
          page: params.page,
          pageSize: params.pageSize,
          role: params.role,
        },
      },
    );
    return response.data;
  },
  update: async (id: string, user: UpdateUserRequest) => {
    const response = await api.put<UserResponse>(`${BASE_URL}/${id}`, user);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<boolean>(`${BASE_URL}/${id}`);
    return response.data;
  },
};

export default UserService;
