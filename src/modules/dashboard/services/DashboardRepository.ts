import type {
  DashboardStats,
  SalesDataPoint,
  ClientDataPoint,
} from '../models';

/**
 * Contrato del repositorio del dashboard.
 */
export interface IDashboardRepository {
  getStats(): Promise<DashboardStats>;
  getSalesData(): Promise<SalesDataPoint[]>;
  getClientData(): Promise<ClientDataPoint[]>;
  getChartColors(): string[];
}

