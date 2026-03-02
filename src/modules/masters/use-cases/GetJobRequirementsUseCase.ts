import type { JobRequirementsResponse } from '../models';
import type { JobRequirementsService } from '../services';

/**
 * Use case: get job requirements (GET /api/v1/job-requirements).
 */
export class GetJobRequirementsUseCase {
  constructor(private readonly service: JobRequirementsService) {}

  async execute(): Promise<JobRequirementsResponse> {
    return this.service.getJobRequirements();
  }
}
