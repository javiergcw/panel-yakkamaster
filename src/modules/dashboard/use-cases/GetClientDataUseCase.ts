import type { ClientDataPoint } from '../models';
import type { IDashboardRepository } from '../services';

/**
 * Caso de uso: Obtener datos de clientes para gráficos (pie, etc.)
 */
export class GetClientDataUseCase {
  constructor(private readonly dashboardRepository: IDashboardRepository) {}

  async execute(): Promise<ClientDataPoint[]> {
    return this.dashboardRepository.getClientData();
  }
}
