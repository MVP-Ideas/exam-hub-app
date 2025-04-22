export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
};

export type UserLocalLogin = {
  email: string;
  password: string;
};

export type UserLocalRegister = {
  email: string;
  password: string;
  name: string;
};

export type UserB2CLoginRegister = {
  email: string;
  name: string;
  b2cUserId: string;
  accountType: string;
};
