import type { QuickPostsResponse } from '../models';
import type { QuickPostsService } from '../services';

/**
 * Use case: get quick posts (GET /api/v1/institution/quick-posts).
 */
export class GetQuickPostsUseCase {
  constructor(private readonly service: QuickPostsService) {}

  async execute(): Promise<QuickPostsResponse> {
    return this.service.getQuickPosts();
  }
}
