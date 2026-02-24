import type {
  InstitutionDashboardResponse,
  LaboursResponse,
  BuildersResponse,
  BuilderDetailResponse,
  LabourDetailResponse,
  UpdateVerificationRequest,
  UpdateVerificationResponse,
  OrganizationDetailResponse,
} from '../models';
import { httpClient } from '@/services/http';
import { getAccessToken } from '@/modules/auth';

const DASHBOARD_PATH = 'api/v1/institution/dashboard';
const LABOURS_PATH = 'api/v1/institution/labours';
const BUILDERS_PATH = 'api/v1/institution/builders';
const ORGANIZATION_PATH = 'api/v1/institution/organization';

function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/**
 * Service for institution APIs. Sends Bearer token from auth storage.
 */
export class InstitutionDashboardService {
  async getDashboard(): Promise<InstitutionDashboardResponse> {
    return httpClient.get<InstitutionDashboardResponse>(DASHBOARD_PATH, {
      headers: authHeaders(),
    });
  }

  async getOrganization(): Promise<OrganizationDetailResponse> {
    return httpClient.get<OrganizationDetailResponse>(ORGANIZATION_PATH, {
      headers: authHeaders(),
    });
  }

  /**
   * PUT /api/v1/institution/organization
   * Body: FormData with name, description, website, file (optional)
   */
  async updateOrganization(formData: FormData): Promise<OrganizationDetailResponse> {
    return httpClient.put<OrganizationDetailResponse>(ORGANIZATION_PATH, formData, {
      headers: authHeaders(),
    });
  }

  async getLabours(): Promise<LaboursResponse> {
    return httpClient.get<LaboursResponse>(LABOURS_PATH, {
      headers: authHeaders(),
    });
  }

  async getBuilders(): Promise<BuildersResponse> {
    return httpClient.get<BuildersResponse>(BUILDERS_PATH, {
      headers: authHeaders(),
    });
  }

  async getBuilderById(userId: string): Promise<BuilderDetailResponse> {
    return httpClient.get<BuilderDetailResponse>(`${BUILDERS_PATH}/${userId}`, {
      headers: authHeaders(),
    });
  }

  async getLabourById(userId: string): Promise<LabourDetailResponse> {
    return httpClient.get<LabourDetailResponse>(`${LABOURS_PATH}/${userId}`, {
      headers: authHeaders(),
    });
  }

  async updateLabourVerification(
    userId: string,
    body: UpdateVerificationRequest
  ): Promise<UpdateVerificationResponse> {
    return httpClient.put<UpdateVerificationResponse>(
      `${LABOURS_PATH}/${userId}/verification`,
      body,
      { headers: authHeaders() }
    );
  }

  async updateBuilderVerification(
    userId: string,
    body: UpdateVerificationRequest
  ): Promise<UpdateVerificationResponse> {
    return httpClient.put<UpdateVerificationResponse>(
      `${BUILDERS_PATH}/${userId}/verification`,
      body,
      { headers: authHeaders() }
    );
  }
}
