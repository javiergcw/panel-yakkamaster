import type { BuildersResponse } from '../models';
import type { InstitutionDashboardService } from '../services';

/**
 * Use case: get institution builders list (GET /api/v1/institution/builders).
 */
export class GetBuildersUseCase {
  constructor(private readonly service: InstitutionDashboardService) {}

  async execute(): Promise<BuildersResponse> {
    return this.service.getBuilders();
  }
}
