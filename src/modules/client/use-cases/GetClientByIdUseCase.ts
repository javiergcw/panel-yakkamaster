import type { Client } from '../models';
import type { IClientRepository } from '../services';

/**
 * Caso de uso: Obtener un cliente por ID
 */
export class GetClientByIdUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(id: number): Promise<Client | null> {
    return this.clientRepository.getById(id);
  }
}
