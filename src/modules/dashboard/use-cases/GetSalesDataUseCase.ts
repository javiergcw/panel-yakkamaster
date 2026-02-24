import type { SalesDataPoint } from '../models';
import type { IDashboardRepository } from '../services';

/**
 * Caso de uso: Obtener datos de ventas para gráficos
 */
export class GetSalesDataUseCase {
  constructor(private readonly dashboardRepository: IDashboardRepository) {}

  async execute(): Promise<SalesDataPoint[]> {
    return this.dashboardRepository.getSalesData();
  }
}
