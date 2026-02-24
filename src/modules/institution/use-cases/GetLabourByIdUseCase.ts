import type { LabourDetailResponse } from '../models';
import type { InstitutionDashboardService } from '../services';

/**
 * Use case: get labour detail by user id (GET /api/v1/institution/labours/:user_id).
 */
export class GetLabourByIdUseCase {
  constructor(private readonly service: InstitutionDashboardService) {}

  async execute(userId: string): Promise<LabourDetailResponse> {
    return this.service.getLabourById(userId);
  }
}
