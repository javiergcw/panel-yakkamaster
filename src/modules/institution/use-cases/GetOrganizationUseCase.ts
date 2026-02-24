import type { OrganizationDetailResponse } from '../models';
import type { InstitutionDashboardService } from '../services';

/**
 * Use case: get institution organization (GET /api/v1/institution/organization).
 */
export class GetOrganizationUseCase {
  constructor(private readonly service: InstitutionDashboardService) {}

  async execute(): Promise<OrganizationDetailResponse> {
    return this.service.getOrganization();
  }
}
