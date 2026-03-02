import type { Jobsite } from '../models';
import type { UpdateJobsiteRequest } from '../models';
import type { InstitutionDashboardService } from '../services';

/**
 * Use case: update jobsite (PUT /api/v1/institution/jobsites/:id_jobsite).
 */
export class UpdateJobsiteUseCase {
  constructor(private readonly service: InstitutionDashboardService) {}

  async execute(idJobsite: string, body: UpdateJobsiteRequest): Promise<Jobsite> {
    return this.service.updateJobsite(idJobsite, body);
  }
}
