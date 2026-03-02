import type { LicensesResponse } from '../models';
import { httpClient } from '@/services/http';
import { getAccessToken } from '@/modules/auth';

const LICENSES_PATH = 'api/v1/licenses';

function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/**
 * Service for licenses API (GET /api/v1/licenses).
 */
export class LicensesService {
  async getLicenses(): Promise<LicensesResponse> {
    return httpClient.get<LicensesResponse>(LICENSES_PATH, {
      headers: authHeaders(),
    });
  }
}
