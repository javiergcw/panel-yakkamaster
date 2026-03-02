import type { InstitutionProfileCompany } from './InstitutionDetail';

/**
 * GET /api/v1/institution/jobsites
 * Single jobsite item.
 */
export interface Jobsite {
  id: string;
  builder_id: string;
  company_id: string;
  address: string;
  city: string;
  suburb: string;
  description: string | null;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

export interface JobsitesResponse {
  company: InstitutionProfileCompany;
  jobsites: Jobsite[];
  total: number;
}

/**
 * POST /api/v1/institution/jobsites
 * Body for creating a jobsite.
 */
export interface CreateJobsiteRequest {
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  suburb: string;
  description?: string | null;
  phone?: string | null;
}

/**
 * PUT /api/v1/institution/jobsites/:id_jobsite
 * Body for updating a jobsite.
 */
export interface UpdateJobsiteRequest {
  address: string;
  city: string;
  suburb: string;
  description: string | null;
  latitude: number;
  longitude: number;
  phone: string;
}
