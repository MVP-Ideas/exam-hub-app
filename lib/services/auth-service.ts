import api from "@/lib/axios";
import { RegisterOrLoginB2CRequest, TokenResponse } from "@/lib/types/auth";

const BASE_URL = "auth";

const AuthService = {
  b2cLoginRegister: async (
    userDto: RegisterOrLoginB2CRequest,
    accessToken: string,
  ) => {
    const response = await api.post<TokenResponse>(`${BASE_URL}/b2c`, userDto, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
  verifyToken: async () => {
    const response = await api.post<boolean>(`${BASE_URL}/verify`);
    return response.data;
  },
  logout: async () => {
    await api.post(`${BASE_URL}/logout`);
  },
};

export default AuthService;
