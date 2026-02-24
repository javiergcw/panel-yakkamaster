/**
 * Modelos de dominio para autenticación
 */

export type UserRole = 'institution' | 'labour' | 'builder' | string;
export type UserStatus = 'active' | 'inactive' | string;

export interface User {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  photo: string | null;
  link_instagram: string | null;
  link_linkedin: string | null;
  status: UserStatus;
  role: UserRole;
  register_by: string;
  last_login_at: string;
  created_at: string;
  updated_at: string;
  role_changed_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthProfiles {
  has_builder_profile: boolean;
  has_labour_profile: boolean;
  has_any_profile: boolean;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  profiles: AuthProfiles;
}
