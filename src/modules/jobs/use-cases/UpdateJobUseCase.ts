import type { CreateJobRequest } from '../models';
import type { Job } from '@/modules/institution';
import type { JobsService } from '../services';

/**
 * Use case: update job (PUT /api/v1/institution/jobs/:id).
 */
export class UpdateJobUseCase {
  constructor(private readonly service: JobsService) {}

  async execute(id: string, body: CreateJobRequest): Promise<Job> {
    return this.service.updateJob(id, body);
  }
}
