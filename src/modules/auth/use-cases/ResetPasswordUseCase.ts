import type { ResetPasswordBody, ResetPasswordResponse } from '../models';
import type { AuthService } from '../services';

/**
 * Use case: reset password with OTP (POST /api/v1/auth/password/reset).
 */
export class ResetPasswordUseCase {
  constructor(private readonly service: AuthService) {}

  async execute(body: ResetPasswordBody): Promise<ResetPasswordResponse> {
    return this.service.resetPassword(body);
  }
}
