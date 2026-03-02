import type { CompaniesResponse } from '../models';
import type { CompaniesService } from '../services';

/**
 * Use case: get companies list (GET /api/v1/companies).
 */
export class GetCompaniesUseCase {
  constructor(private readonly service: CompaniesService) {}

  async execute(): Promise<CompaniesResponse> {
    return this.service.getCompanies();
  }
}
