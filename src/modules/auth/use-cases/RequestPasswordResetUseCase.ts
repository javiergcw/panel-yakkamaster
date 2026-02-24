import type { RequestPasswordResetResponse } from '../models';
import type { AuthService } from '../services';

/**
 * Use case: request password reset email (POST /api/v1/auth/password/request-reset).
 */
export class RequestPasswordResetUseCase {
  constructor(private readonly service: AuthService) {}

  async execute(email: string): Promise<RequestPasswordResetResponse> {
    return this.service.requestPasswordReset(email);
  }
}
