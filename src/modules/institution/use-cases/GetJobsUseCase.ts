import type { JobsResponse } from '../models';
import type { InstitutionJobsService } from '../services';

/**
 * Use case: get institution jobs list (GET /api/v1/institution/jobs).
 */
export class GetJobsUseCase {
    constructor(private readonly service: InstitutionJobsService) { }

    async execute(): Promise<JobsResponse> {
        return this.service.getJobs();
    }
}
