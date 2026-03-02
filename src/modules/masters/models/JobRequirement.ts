/**
 * GET /api/v1/job-requirements
 */
export interface JobRequirement {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobRequirementsResponse {
  requirements: JobRequirement[];
  message?: string;
}
