import type { SkillsResponse } from '../models';
import { httpClient } from '@/services/http';
import { getAccessToken } from '@/modules/auth';

const SKILLS_PATH = 'api/v1/skills';

function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/**
 * Service for skills API (GET /api/v1/skills).
 */
export class SkillsService {
  async getSkills(): Promise<SkillsResponse> {
    return httpClient.get<SkillsResponse>(SKILLS_PATH, {
      headers: authHeaders(),
    });
  }
}
