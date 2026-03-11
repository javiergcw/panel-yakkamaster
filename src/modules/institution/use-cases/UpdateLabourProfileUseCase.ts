import type { UpdateLabourProfileRequest } from '../models';
import type { LabourDetailResponse } from '../models';
import type { InstitutionDashboardService } from '../services';

/**
 * Use case: update labour profile (PUT /api/v1/institution/labours/:user_id).
 * Use buildUpdateLabourProfilePayload() so all fields are sent and empty values are null.
 */
export class UpdateLabourProfileUseCase {
  constructor(private readonly service: InstitutionDashboardService) {}

  async execute(userId: string, body: UpdateLabourProfileRequest): Promise<LabourDetailResponse> {
    return this.service.updateLabourProfile(userId, body);
  }
}
