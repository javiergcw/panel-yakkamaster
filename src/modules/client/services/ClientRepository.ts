import type { Client } from '../models';

/**
 * Contrato del repositorio de clientes (abstrae la fuente de datos).
 * Permite cambiar entre datos fake, API REST, etc. sin tocar los casos de uso.
 */
export interface IClientRepository {
  getAll(): Promise<Client[]>;
  getById(id: number): Promise<Client | null>;
}
