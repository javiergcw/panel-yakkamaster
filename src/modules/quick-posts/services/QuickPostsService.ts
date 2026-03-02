import type { QuickPostsResponse, QuickPostDetailResponse } from '../models';
import type { QuickPost } from '../models';
import { httpClient } from '@/services/http';
import { getAccessToken } from '@/modules/auth';

const QUICK_POSTS_PATH = 'api/v1/institution/quick-posts';

function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/**
 * Service for quick-posts API.
 */
export class QuickPostsService {
  async getQuickPosts(): Promise<QuickPostsResponse> {
    return httpClient.get<QuickPostsResponse>(QUICK_POSTS_PATH, {
      headers: authHeaders(),
    });
  }

  async getQuickPostById(id: string): Promise<QuickPost> {
    const response = await httpClient.get<QuickPostDetailResponse>(`${QUICK_POSTS_PATH}/${id}`, {
      headers: authHeaders(),
    });
    return response.quick_post;
  }

  /**
   * POST /api/v1/institution/quick-posts
   * Body: FormData (image: file, caption: text, is_active: "true"|"false", visibility: "true"|"false")
   */
  async createQuickPost(formData: FormData): Promise<QuickPost> {
    const response = await httpClient.post<QuickPost | { quick_post: QuickPost }>(
      QUICK_POSTS_PATH,
      formData,
      { headers: authHeaders() }
    );
    if (response && typeof response === 'object' && 'quick_post' in response) {
      return response.quick_post;
    }
    return response as QuickPost;
  }

  /**
   * PUT /api/v1/institution/quick-posts/:id
   * Body: FormData (image?: file, caption: text, is_active: "true"|"false", visibility: "true"|"false")
   */
  async updateQuickPost(id: string, formData: FormData): Promise<QuickPost> {
    const response = await httpClient.put<QuickPost | { quick_post: QuickPost }>(
      `${QUICK_POSTS_PATH}/${id}`,
      formData,
      { headers: authHeaders() }
    );
    if (response && typeof response === 'object' && 'quick_post' in response) {
      return response.quick_post;
    }
    return response as QuickPost;
  }
}
