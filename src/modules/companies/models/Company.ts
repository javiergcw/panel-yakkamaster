/**
 * GET /api/v1/companies
 */
export interface Company {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  logo: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompaniesResponse {
  companies: Company[];
  total: number;
  message: string;
}
