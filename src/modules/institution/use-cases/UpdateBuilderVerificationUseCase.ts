import type { UpdateVerificationRequest, UpdateVerificationResponse } from '../models';
import type { InstitutionDashboardService } from '../services';

/**
 * Use case: update builder verification status (PUT /api/v1/institution/builders/:user_id/verification).
 */
export class UpdateBuilderVerificationUseCase {
  constructor(private readonly service: InstitutionDashboardService) {}

  async execute(userId: string, body: UpdateVerificationRequest): Promise<UpdateVerificationResponse> {
    return this.service.updateBuilderVerification(userId, body);
  }
}
