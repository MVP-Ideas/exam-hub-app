export type RegisterOrLoginB2CRequest = {
  email: string;
  name: string;
  b2cUserId: string;
  accountType: string;
};

// Responses
export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
};
