import type { InstitutionProfileResponse } from '../models';
import type { InstitutionDashboardService } from '../services';

/**
 * Use case: update institution profile (PUT /api/v1/institution/profile).
 * Body: { company_id: string }
 */
export class UpdateInstitutionProfileUseCase {
  constructor(private readonly service: InstitutionDashboardService) {}

  async execute(companyId: string): Promise<InstitutionProfileResponse> {
    return this.service.updateProfile({ company_id: companyId });
  }
}
