/**
 * GET /api/v1/job-types
 */
export interface JobType {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobTypesResponse {
  types: JobType[];
  message?: string;
}
