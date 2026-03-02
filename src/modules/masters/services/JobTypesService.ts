import type { JobTypesResponse } from '../models';
import { httpClient } from '@/services/http';
import { getAccessToken } from '@/modules/auth';

const JOB_TYPES_PATH = 'api/v1/job-types';

function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/**
 * Service for job types API (GET /api/v1/job-types).
 */
export class JobTypesService {
  async getJobTypes(): Promise<JobTypesResponse> {
    return httpClient.get<JobTypesResponse>(JOB_TYPES_PATH, {
      headers: authHeaders(),
    });
  }
}
