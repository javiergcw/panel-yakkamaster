import type { ClientStatus } from '../models';

/**
 * Caso de uso / utilidad: color de UI para el estado del cliente
 */
export function getStatusColor(status: ClientStatus | string): string {
  switch (status) {
    case 'Active':
      return '#66bb6a';
    case 'Inactive':
      return '#86868b';
    case 'New':
      return '#81c784';
    default:
      return '#86868b';
  }
}
