import type { BuilderDetailResponse } from '../models';
import type { InstitutionDashboardService } from '../services';

/**
 * Use case: get builder detail by user id (GET /api/v1/institution/builders/:user_id).
 */
export class GetBuilderByIdUseCase {
  constructor(private readonly service: InstitutionDashboardService) {}

  async execute(userId: string): Promise<BuilderDetailResponse> {
    return this.service.getBuilderById(userId);
  }
}
