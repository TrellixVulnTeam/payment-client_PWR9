import i18n from 'i18n';

export type ErrorMessage =
  | 'LOGIN_WRONG_USERNAME'
  | 'LOGIN_WRONG_PASSWORD'
  | 'USER_NOT_FOUND'
  | 'PASSWORD_RESET_CAPTCHA_INCORRECT'
  | 'PASSWORD_RESET_EMAIL_NOT_FOUND'
  | 'INVALID_USERNAME_OVER_LENGTH'
  | 'INVALID_USERNAME_REQUIRE_LENGTH'
  | 'MY_ID_SIGN_IN_CREDENTIALS_IS_INVALID'
  | 'INACTIVE';

export const errorMessage: Record<
  ErrorMessage,
  {
    name: string;
    message: string;
  }
> = {
  LOGIN_WRONG_USERNAME: {
    name: 'username',
    message: 'Your username is not correct',
  },
  LOGIN_WRONG_PASSWORD: {
    name: 'password',
    message:
      'Your password is not correct. You have 4 more attempts and your account will be locked for security. Please try again carefully.',
  },
  USER_NOT_FOUND: {
    name: 'notFound',
    message: 'User not found!',
  },
  PASSWORD_RESET_CAPTCHA_INCORRECT: {
    name: 'captcha',
    message: 'Captcha incorrect',
  },
  PASSWORD_RESET_EMAIL_NOT_FOUND: {
    name: 'email',
    message: 'This email does not exist. Please try again.',
  },
  INVALID_USERNAME_OVER_LENGTH: {
    name: 'username',
    message: 'Username over length',
  },
  INVALID_USERNAME_REQUIRE_LENGTH: {
    name: 'username',
    message: 'Username require length',
  },
  MY_ID_SIGN_IN_CREDENTIALS_IS_INVALID: {
    name: 'username',
    message: 'Username or password wrong',
  },
  INACTIVE: {
    name: 'username',
    message: 'Account is inactive',
  },
};

export const getErrorMessage = (message?: string) => {
  if (!message) {
    return 'Something went wrong!';
  }
  return i18n.t(errorMessage[message as ErrorMessage]?.message || `Error: ${message}`);
};

export const ERROR_MESSAGE = {
  0: 'There was an error. Please try again',
  30001: 'Username is incorrect',
  30008: 'Wrong current password',
  30014:
    'Your password is not correct. You have 4 more attempts and your account will be locked for security. Please try again carefully.',
  30005: 'User not found',
  30203: 'Username or password wrong',
  30040: 'Password reset code not available',
  30042: 'Password reset code is expired',
  30204: 'Account is inactive',
  32001: 'Confirm sign in unavailable',
  32101: 'Resend sign in OTP not found. Please try login again.',
  31705: 'Email not found',
  30605: 'Current password is wrong',
  31708: 'User is locked',
  31107: 'Username is existed',
  31111: 'User phone number is invalid',
  31104: 'Username is too long',
  31112: 'User phone number is existed',
  30205: 'User is locked',
  30612: `New password can't be used because it is the same as an old one`,
  32002: 'OTP verify sign in is invalid',
  30903: 'OTP verify email is expired',
  31803: 'OTP verify reset password is expired',
  32003: 'OTP confirm sign in is expired',
  32503: 'OTP verify phone number is expired',
  32203: 'OTP create new password is expired',
  31903: 'OTP reset password is expired',
  31910: `New password can't be used because it is the same as an old one`,
  30207: 'User is locked',
  30206: 'Account is inactive',
  31707: 'Account is inactive',
  31103: 'Username is too short',
  31110: 'Email already exists',
  30303: 'Invalid account number or account name',
  32201: 'Link create password is unavailable',
  30102: 'Account number is existed',
};

export const getErrorMessageFromCode = (code: number | string, defaultMessage?: string) => {
  if (ERROR_MESSAGE[code]) {
    return i18n.t(ERROR_MESSAGE[code]);
  }
  return defaultMessage || i18n.t(ERROR_MESSAGE[0]);
};
