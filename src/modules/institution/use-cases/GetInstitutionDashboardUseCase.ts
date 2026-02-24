import type { InstitutionDashboardResponse } from '../models';
import type { InstitutionDashboardService } from '../services';

/**
 * Use case: get institution dashboard (organization, summary, labours, builders).
 */
export class GetInstitutionDashboardUseCase {
  constructor(private readonly institutionDashboardService: InstitutionDashboardService) {}

  async execute(): Promise<InstitutionDashboardResponse> {
    return this.institutionDashboardService.getDashboard();
  }
}
