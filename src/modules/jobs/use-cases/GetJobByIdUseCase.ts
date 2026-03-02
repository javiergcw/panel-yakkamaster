import type { Job } from '@/modules/institution';
import type { JobsService } from '../services';

/**
 * Use case: get job by id (GET /api/v1/institution/jobs/:id).
 */
export class GetJobByIdUseCase {
  constructor(private readonly service: JobsService) {}

  async execute(id: string): Promise<Job> {
    return this.service.getJobById(id);
  }
}
