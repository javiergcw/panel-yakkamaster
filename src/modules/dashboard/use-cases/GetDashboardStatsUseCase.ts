import type { DashboardStats } from '../models';
import type { IDashboardRepository } from '../services';

/**
 * Caso de uso: Obtener estadísticas del dashboard
 */
export class GetDashboardStatsUseCase {
  constructor(private readonly dashboardRepository: IDashboardRepository) {}

  async execute(): Promise<DashboardStats> {
    return this.dashboardRepository.getStats();
  }
}
