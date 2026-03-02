import type { CompaniesResponse } from '../models';
import { httpClient } from '@/services/http';
import { getAccessToken } from '@/modules/auth';

const COMPANIES_PATH = 'api/v1/companies';

function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/**
 * Service for companies API (GET list).
 */
export class CompaniesService {
  async getCompanies(): Promise<CompaniesResponse> {
    return httpClient.get<CompaniesResponse>(COMPANIES_PATH, {
      headers: authHeaders(),
    });
  }
}
