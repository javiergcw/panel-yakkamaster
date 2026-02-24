import type { OrganizationDetailResponse } from '../models';
import type { InstitutionDashboardService } from '../services';

/**
 * Use case: update institution organization (PUT /api/v1/institution/organization).
 * Body: FormData with name, description, website, file (optional).
 */
export class UpdateOrganizationUseCase {
  constructor(private readonly service: InstitutionDashboardService) {}

  async execute(formData: FormData): Promise<OrganizationDetailResponse> {
    return this.service.updateOrganization(formData);
  }
}
