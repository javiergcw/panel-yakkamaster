import type { QuickPost } from '../models';
import type { QuickPostsService } from '../services';

/**
 * Use case: create quick post (POST /api/v1/institution/quick-posts, FormData).
 */
export class CreateQuickPostUseCase {
  constructor(private readonly service: QuickPostsService) {}

  async execute(formData: FormData): Promise<QuickPost> {
    return this.service.createQuickPost(formData);
  }
}
