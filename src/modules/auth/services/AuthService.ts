import type {
  LoginCredentials,
  LoginResponse,
  RequestPasswordResetResponse,
  ResetPasswordBody,
  ResetPasswordResponse,
} from '../models';
import { httpClient } from '@/services/http';

const AUTH_PATH = 'api/v1/auth';
const AUTH_LOGIN_PATH = `${AUTH_PATH}/login`;

/**
 * Servicio de autenticación. Usa el cliente HTTP general.
 */
export class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return httpClient.post<LoginResponse>(AUTH_LOGIN_PATH, credentials);
  }

  /** POST /api/v1/auth/password/request-reset */
  async requestPasswordReset(email: string): Promise<RequestPasswordResetResponse> {
    return httpClient.post<RequestPasswordResetResponse>(`${AUTH_PATH}/password/request-reset`, {
      email,
    });
  }

  /** POST /api/v1/auth/password/reset */
  async resetPassword(body: ResetPasswordBody): Promise<ResetPasswordResponse> {
    return httpClient.post<ResetPasswordResponse>(`${AUTH_PATH}/password/reset`, body);
  }
}
