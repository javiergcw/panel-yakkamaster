import type { LaboursResponse } from '../models';
import type { InstitutionDashboardService } from '../services';

/**
 * Use case: get institution labours list (GET /api/v1/institution/labours).
 */
export class GetLaboursUseCase {
  constructor(private readonly service: InstitutionDashboardService) {}

  async execute(): Promise<LaboursResponse> {
    return this.service.getLabours();
  }
}
