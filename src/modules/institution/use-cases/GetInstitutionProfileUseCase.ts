import type { InstitutionProfileResponse } from '../models';
import type { InstitutionDashboardService } from '../services';

/**
 * Use case: get institution profile (GET /api/v1/institution/profile).
 */
export class GetInstitutionProfileUseCase {
  constructor(private readonly service: InstitutionDashboardService) {}

  async execute(): Promise<InstitutionProfileResponse> {
    return this.service.getProfile();
  }
}
