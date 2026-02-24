/**
 * Modelo de dominio: estadísticas del dashboard
 */
export interface SalesDataPoint {
  name: string;
  sales: number;
  revenue: number;
}

export interface ClientDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface DashboardStats {
  totalSales: number;
  clients: number;
  orders: number;
  growth: number;
}
