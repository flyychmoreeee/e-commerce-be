export const SUCCESS_CODES = {
  // 20XX: General
  GENERAL_SUCCESS: '2000',
  DATA_FOUND: '2001',
  DATA_CREATED: '2002',
  DATA_UPDATED: '2003',
  DATA_DELETED: '2004',
  DATA_FETCHED: '2005',

  // 21XX: Auth
  LOGIN_SUCCESS: '2102',
  LOGOUT_SUCCESS: '2103',
  PASSWORD_UPDATE_SUCCESS: '2107',
  TOKEN_VALID: '2108',
  REGISTRATION_SUCCESS: '2109',
  TOKEN_REFRESHED: '2110',
  VERIFICATION_SENT: '2201',
  EMAIL_VERIFIED: '2202',
  REGISTRATION_PENDING: '2203',
} as const;

export const SUCCESS_MESSAGES = {
  // 20XX: General
  [SUCCESS_CODES.GENERAL_SUCCESS]: (
    action?: string,
  ) => (action ? `Success ${action}` : 'Success'),
  [SUCCESS_CODES.DATA_FOUND]: (entity?: string) =>
    `${entity || 'Data'} found`,
  [SUCCESS_CODES.DATA_CREATED]: (
    entity?: string,
  ) => `${entity || 'Data'} created`,
  [SUCCESS_CODES.DATA_UPDATED]: (
    entity?: string,
  ) => `${entity || 'Data'} updated`,
  [SUCCESS_CODES.DATA_DELETED]: (
    entity?: string,
  ) => `${entity || 'Data'} deleted`,
  [SUCCESS_CODES.DATA_FETCHED]: (
    entity?: string,
  ) => `${entity || 'Data'} fetched`,

  // 21XX: Auth
  [SUCCESS_CODES.LOGIN_SUCCESS]:
    'Successfully logged in',
  [SUCCESS_CODES.LOGOUT_SUCCESS]:
    'Successfully logged out',
  [SUCCESS_CODES.PASSWORD_UPDATE_SUCCESS]:
    'Password has been successfully reset',
  [SUCCESS_CODES.TOKEN_VALID]: 'Token is valid',
  [SUCCESS_CODES.REGISTRATION_SUCCESS]:
    'User registered successfully',
  [SUCCESS_CODES.TOKEN_REFRESHED]:
    'Token refreshed',
  [SUCCESS_CODES.VERIFICATION_SENT]:
    'Verification code sent successfully',
  [SUCCESS_CODES.EMAIL_VERIFIED]:
    'Email verified successfully',
  [SUCCESS_CODES.REGISTRATION_PENDING]:
    'Registration pending. Please check your email for verification code',
} as const;

export const ERROR_CODES = {
  // 10XX : Main App Errors
  APP_SERVER_ERROR: 1000,
  MISSING_HEADERS: 1001,
  MISSING_PARAMETERS: 1002,
  INVALID_OFFSET_LIMIT: 1003,
  INVALID_LOCALE: 1004,
  INVALID_TIMEZONE: 1005,
  RATE_LIMIT_EXCEEDED: 1006,
  VALIDATION_ERROR: 1007,

  // 11XX : Http Errors
  UNAUTHORIZED: 1100,
  NOT_AUTHORIZED_TO_ACCESS: 1101,
  UNPROCESSABLE_ENTITY: 1102,
  AUTHENTICATION_FAILED: 1103,
  NOT_FOUND: 1104,
  CONFLICT: 1105,
  FORBIDDEN: 1106,
  PAYLOAD_TOO_LARGE: 1107,
  INVALID_ROLES: 1108,

  // 12XX : Auth Errors
  SESSION_EXPIRED: '1201',
  EXPIRED_RESET_TOKEN: '1202',
  INVALID_RESET_TOKEN: '1203',
  INVALID_SESSION_TOKEN: '1204',
  UNAUTHORIZED_LOGIN_REQUIRED: '1205',
  AUTHENTICATION_USER_NOT_FOUND: '1206',
  USER_NOT_FOUND: '1207',
  USER_ALREADY_VERIFIED: '1208',
  RESET_PASSWORD_TOO_SOON: '1209',
  PASSWORD_NOT_SAME: '1210',
  INVALID_CREDENTIALS: '1211',
  INVALID_REFRESH_TOKEN: '1302',
  EMAIL_NOT_VERIFIED: '1401',
  INVALID_VERIFICATION_CODE: '1402',
  VERIFICATION_EXPIRED: '1403',
  EMAIL_ALREADY_VERIFIED: '1404',
  TOKEN_GENERATION_FAILED: '1405',
} as const;

export const ERROR_MESSAGES = {
  // 10XX : Main App Errors
  [ERROR_CODES.APP_SERVER_ERROR]:
    'App Server Error, try again later.',
  [ERROR_CODES.MISSING_HEADERS]:
    'Missing Headers',
  [ERROR_CODES.MISSING_PARAMETERS]:
    'Missing Parameters',
  [ERROR_CODES.INVALID_OFFSET_LIMIT]:
    'Invalid Offset Limit',
  [ERROR_CODES.INVALID_LOCALE]: 'Invalid Locale',
  [ERROR_CODES.INVALID_TIMEZONE]:
    'Invalid Timezone',
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]:
    'Rate Limit Exceeded',
  [ERROR_CODES.VALIDATION_ERROR]:
    'Validation Error',

  // 11XX : Http Errors
  [ERROR_CODES.UNAUTHORIZED]:
    'Unauthorized access, please authenticate',
  [ERROR_CODES.NOT_AUTHORIZED_TO_ACCESS]:
    'Not authorized to access this resource',
  [ERROR_CODES.UNPROCESSABLE_ENTITY]:
    'Unprocessable Entity, please check the request',
  [ERROR_CODES.AUTHENTICATION_FAILED]:
    'Authentication failed, please check credentials',
  [ERROR_CODES.NOT_FOUND]: (entity?: string) =>
    `${entity || 'Resource'} not found`,
  [ERROR_CODES.CONFLICT]: (entity?: string) =>
    `${entity || 'Data'} already exists`,
  [ERROR_CODES.FORBIDDEN]: (entity?: string) =>
    `You are not authorized to access this ${entity || 'resource'}`,
  [ERROR_CODES.PAYLOAD_TOO_LARGE]:
    'Your request file size is too large',
  [ERROR_CODES.INVALID_ROLES]:
    'Access denied: Insufficient permissions.',

  // 12XX : Auth Errors
  [ERROR_CODES.SESSION_EXPIRED]:
    'Your session has expired. Please log in again to continue',
  [ERROR_CODES.EXPIRED_RESET_TOKEN]:
    'The reset token has expired. Please request a new password reset to continue.',
  [ERROR_CODES.INVALID_RESET_TOKEN]:
    'The reset token is invalid. Please request a new password reset and try again.',
  [ERROR_CODES.INVALID_SESSION_TOKEN]:
    'Invalid authentication token. Please log in again',
  [ERROR_CODES.UNAUTHORIZED_LOGIN_REQUIRED]:
    'Authentication required. Please log in to access this resource',
  [ERROR_CODES.AUTHENTICATION_USER_NOT_FOUND]:
    'User account not found or has been deactivated',
  [ERROR_CODES.USER_NOT_FOUND]: 'User not found',
  [ERROR_CODES.USER_ALREADY_VERIFIED]:
    'User already verified',
  [ERROR_CODES.RESET_PASSWORD_TOO_SOON]:
    'Password reset request can only be made once a month. Please try again later.',
  [ERROR_CODES.PASSWORD_NOT_SAME]:
    'The new password cannot be the same as the previous password.',
  [ERROR_CODES.INVALID_CREDENTIALS]:
    'Invalid credentials',
  [ERROR_CODES.INVALID_REFRESH_TOKEN]:
    'Invalid refresh token',
  [ERROR_CODES.EMAIL_NOT_VERIFIED]:
    'Email not verified',
  [ERROR_CODES.INVALID_VERIFICATION_CODE]:
    'Invalid verification code',
  [ERROR_CODES.VERIFICATION_EXPIRED]:
    'Verification code has expired',
  [ERROR_CODES.EMAIL_ALREADY_VERIFIED]:
    'Email already verified',
  [ERROR_CODES.TOKEN_GENERATION_FAILED]:
    'Failed to generate authentication tokens',
} as const;
