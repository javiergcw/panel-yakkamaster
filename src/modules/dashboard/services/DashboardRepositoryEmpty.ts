import type { IDashboardRepository } from './DashboardRepository';
import type {
  DashboardStats,
  SalesDataPoint,
  ClientDataPoint,
} from '../models';

const EMPTY_STATS: DashboardStats = {
  totalSales: 0,
  clients: 0,
  orders: 0,
  growth: 0,
};

const CHART_COLORS = ['#66bb6a', '#81c784', '#a5d6a7'];

/**
 * Implementación vacía: sin datos mock. Inyectar un repositorio real (API) cuando exista.
 */
export class DashboardRepositoryEmpty implements IDashboardRepository {
  async getStats(): Promise<DashboardStats> {
    return { ...EMPTY_STATS };
  }

  async getSalesData(): Promise<SalesDataPoint[]> {
    return [];
  }

  async getClientData(): Promise<ClientDataPoint[]> {
    return [];
  }

  getChartColors(): string[] {
    return [...CHART_COLORS];
  }
}
