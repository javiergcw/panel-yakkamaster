import type { CreateJobRequest } from '../models';
import type { Job } from '@/modules/institution';
import { httpClient } from '@/services/http';
import { getAccessToken } from '@/modules/auth';

const JOBS_PATH = 'api/v1/institution/jobs';

function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/**
 * Service for job APIs.
 */
export class JobsService {
  async createJob(body: CreateJobRequest): Promise<Job> {
    return httpClient.post<Job>(JOBS_PATH, body, {
      headers: authHeaders(),
    });
  }

  /**
   * GET /api/v1/institution/jobs/:id
   * API returns { job: Job, message?: string }
   */
  async getJobById(id: string): Promise<Job> {
    const response = await httpClient.get<{ job: Job }>(`${JOBS_PATH}/${id}`, {
      headers: authHeaders(),
    });
    return response.job;
  }

  /**
   * PUT /api/v1/institution/jobs/:id
   */
  async updateJob(id: string, body: CreateJobRequest): Promise<Job> {
    return httpClient.put<Job>(`${JOBS_PATH}/${id}`, body, {
      headers: authHeaders(),
    });
  }
}
