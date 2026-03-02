import type { JobRequirementsResponse } from '../models';
import { httpClient } from '@/services/http';
import { getAccessToken } from '@/modules/auth';

const JOB_REQUIREMENTS_PATH = 'api/v1/job-requirements';

function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/**
 * Service for job requirements API (GET /api/v1/job-requirements).
 */
export class JobRequirementsService {
  async getJobRequirements(): Promise<JobRequirementsResponse> {
    return httpClient.get<JobRequirementsResponse>(JOB_REQUIREMENTS_PATH, {
      headers: authHeaders(),
    });
  }
}
