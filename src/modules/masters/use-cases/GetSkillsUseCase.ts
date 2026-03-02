import type { SkillsResponse } from '../models';
import type { SkillsService } from '../services';

/**
 * Use case: get skills (GET /api/v1/skills).
 */
export class GetSkillsUseCase {
  constructor(private readonly service: SkillsService) {}

  async execute(): Promise<SkillsResponse> {
    return this.service.getSkills();
  }
}
