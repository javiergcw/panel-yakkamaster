import type { JobsResponse } from '../models';
import { httpClient } from '@/services/http';
import { getAccessToken } from '@/modules/auth';

const JOBS_PATH = 'api/v1/institution/jobs';

function authHeaders(): Record<string, string> {
    const token = getAccessToken();
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
}

/**
 * Service for institution jobs APIs.
 */
export class InstitutionJobsService {
    async getJobs(): Promise<JobsResponse> {
        return httpClient.get<JobsResponse>(JOBS_PATH, {
            headers: authHeaders(),
        });
    }
}
