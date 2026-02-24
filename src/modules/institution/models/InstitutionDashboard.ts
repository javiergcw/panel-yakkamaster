/**
 * Models for GET /api/v1/institution/dashboard
 */

export interface Organization {
  id: string;
  name: string;
}

export interface DashboardSummary {
  total_labours: number;
  total_builders: number;
  labours_pending: number;
  labours_verified: number;
  labours_not_verified: number;
  builders_pending: number;
  builders_verified: number;
  builders_not_verified: number;
}

export type VerificationStatus = 'pending' | 'verified' | 'not_verified';

export interface Labour {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  photo: string | null;
  role: 'labour';
  status: string;
  verification_status: VerificationStatus;
  associated_at: string;
}

export interface Builder {
  id: string;
  email?: string;
  phone: string;
  photo: string | null;
  first_name?: string;
  last_name?: string;
  role: 'builder';
  status: string;
  verification_status: VerificationStatus;
  associated_at: string;
}

export interface InstitutionDashboardResponse {
  organization: Organization;
  summary: DashboardSummary;
  labours: Labour[];
  builders: Builder[];
}

/** Response for GET /api/v1/institution/labours */
export interface LaboursResponse {
  labours: Labour[];
  total: number;
}

/** Response for GET /api/v1/institution/builders */
export interface BuildersResponse {
  builders: Builder[];
  total: number;
}
