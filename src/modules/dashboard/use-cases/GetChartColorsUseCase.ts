import type { IDashboardRepository } from '../services';

/**
 * Caso de uso: Obtener paleta de colores para gráficos
 */
export class GetChartColorsUseCase {
  constructor(private readonly dashboardRepository: IDashboardRepository) {}

  execute(): string[] {
    return this.dashboardRepository.getChartColors();
  }
}
