import type { Client } from '../models';
import type { IClientRepository } from '../services';

/**
 * Caso de uso: Obtener lista de clientes
 */
export class GetClientsUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(): Promise<Client[]> {
    return this.clientRepository.getAll();
  }
}
