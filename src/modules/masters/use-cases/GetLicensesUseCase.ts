import type { LicensesResponse } from '../models';
import type { LicensesService } from '../services';

/**
 * Use case: get licenses (GET /api/v1/licenses).
 */
export class GetLicensesUseCase {
  constructor(private readonly service: LicensesService) {}

  async execute(): Promise<LicensesResponse> {
    return this.service.getLicenses();
  }
}
