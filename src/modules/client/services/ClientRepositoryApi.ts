import type { IClientRepository } from './ClientRepository';
import type { Client } from '../models';
import { httpClient } from '@/services/http';

/**
 * Implementación del repositorio de clientes usando el servicio HTTP general.
 * Espera un backend en GET /api/clients y GET /api/clients/:id
 */
export class ClientRepositoryApi implements IClientRepository {
  private readonly basePath = 'clients';

  async getAll(): Promise<Client[]> {
    const data = await httpClient.get<Client[]>(this.basePath);
    return Array.isArray(data) ? data : [];
  }

  async getById(id: number): Promise<Client | null> {
    try {
      return await httpClient.get<Client>(`${this.basePath}/${id}`);
    } catch {
      return null;
    }
  }
}
