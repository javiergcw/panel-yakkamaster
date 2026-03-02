import type { QuickPost } from '../models';
import type { QuickPostsService } from '../services';

/**
 * Use case: get quick post by id (GET /api/v1/institution/quick-posts/:id).
 */
export class GetQuickPostByIdUseCase {
  constructor(private readonly service: QuickPostsService) {}

  async execute(id: string): Promise<QuickPost> {
    return this.service.getQuickPostById(id);
  }
}
