import type { UpdateVerificationRequest, UpdateVerificationResponse } from '../models';
import type { InstitutionDashboardService } from '../services';

/**
 * Use case: update labour verification status (PUT /api/v1/institution/labours/:user_id/verification).
 */
export class UpdateLabourVerificationUseCase {
  constructor(private readonly service: InstitutionDashboardService) {}

  async execute(userId: string, body: UpdateVerificationRequest): Promise<UpdateVerificationResponse> {
    return this.service.updateLabourVerification(userId, body);
  }
}
