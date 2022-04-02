export type AuthLoginThunk = {
  username: string;
  password: string;
};

export type AuthVerifyAccessTokenThunk = {
  accessToken: string;
};
