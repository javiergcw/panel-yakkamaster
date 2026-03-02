import type { Jobsite } from '../models';
import type { InstitutionDashboardService } from '../services';

/**
 * Use case: create jobsite (POST /api/v1/institution/jobsites).
 */
export class CreateJobsiteUseCase {
  constructor(private readonly service: InstitutionDashboardService) {}

  async execute(body: {
    address: string;
    latitude: number;
    longitude: number;
    city: string;
    suburb: string;
    description?: string | null;
    phone?: string | null;
  }): Promise<Jobsite> {
    return this.service.createJobsite(body);
  }
}
