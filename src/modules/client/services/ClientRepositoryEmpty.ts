import type { IClientRepository } from './ClientRepository';
import type { Client } from '../models';

/**
 * Implementación vacía: sin datos mock. Inyectar un repositorio real (API) cuando exista.
 */
export class ClientRepositoryEmpty implements IClientRepository {
  async getAll(): Promise<Client[]> {
    return [];
  }

  async getById(): Promise<Client | null> {
    return null;
  }
}
