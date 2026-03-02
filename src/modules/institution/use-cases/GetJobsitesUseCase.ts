import type { JobsitesResponse } from '../models';
import type { InstitutionDashboardService } from '../services';

/**
 * Use case: get institution jobsites (GET /api/v1/institution/jobsites).
 * Returns company and its jobsites.
 */
export class GetJobsitesUseCase {
  constructor(private readonly service: InstitutionDashboardService) {}

  async execute(): Promise<JobsitesResponse> {
    return this.service.getJobsites();
  }
}
