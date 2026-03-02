/**
 * GET /api/v1/licenses
 */
export interface License {
  id: string;
  name: string;
  description: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LicensesResponse {
  data: License[];
  message?: string;
  success?: boolean;
}
