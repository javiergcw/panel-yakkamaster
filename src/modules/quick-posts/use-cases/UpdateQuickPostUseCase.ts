import type { QuickPost } from '../models';
import type { QuickPostsService } from '../services';

/**
 * Use case: update quick post (PUT /api/v1/institution/quick-posts/:id, FormData).
 */
export class UpdateQuickPostUseCase {
  constructor(private readonly service: QuickPostsService) {}

  async execute(id: string, formData: FormData): Promise<QuickPost> {
    return this.service.updateQuickPost(id, formData);
  }
}
