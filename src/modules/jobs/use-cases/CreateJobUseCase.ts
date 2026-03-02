import type { CreateJobRequest } from '../models';
import type { Job } from '@/modules/institution';
import type { JobsService } from '../services';

/**
 * Use case: create job (POST /api/v1/institution/jobs).
 */
export class CreateJobUseCase {
  constructor(private readonly service: JobsService) {}

  async execute(body: CreateJobRequest): Promise<Job> {
    return this.service.createJob(body);
  }
}
