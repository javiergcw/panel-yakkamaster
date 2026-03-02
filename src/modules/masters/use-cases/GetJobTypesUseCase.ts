import type { JobTypesResponse } from '../models';
import type { JobTypesService } from '../services';

/**
 * Use case: get job types (GET /api/v1/job-types).
 */
export class GetJobTypesUseCase {
  constructor(private readonly service: JobTypesService) {}

  async execute(): Promise<JobTypesResponse> {
    return this.service.getJobTypes();
  }
}
