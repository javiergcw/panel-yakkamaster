import type { LoginCredentials, LoginResponse } from '../models';
import type { AuthService } from '../services';

/**
 * Caso de uso: Iniciar sesión con email y contraseña.
 * Usa el servicio de auth (HTTP).
 */
export class LoginUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(credentials: LoginCredentials): Promise<LoginResponse> {
    return this.authService.login(credentials);
  }
}
