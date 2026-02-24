/**
 * POST /api/v1/auth/password/request-reset
 */
export interface RequestPasswordResetBody {
  email: string;
}

export interface RequestPasswordResetResponse {
  message: string;
}

/**
 * POST /api/v1/auth/password/reset
 */
export interface ResetPasswordBody {
  email: string;
  otp: string;
  new_password: string;
}

export interface ResetPasswordResponse {
  message?: string;
}
