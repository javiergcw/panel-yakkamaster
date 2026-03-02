/**
 * GET /api/v1/institution/quick-posts
 * GET /api/v1/institution/quick-posts/:id
 */
export interface QuickPost {
  id: string;
  organization_id: string;
  photo_url: string;
  caption: string;
  is_active: boolean;
  visibility: string;
  created_at: string;
  updated_at: string;
}

export interface QuickPostsResponse {
  quick_posts: QuickPost[];
  total: number;
  message?: string;
}

export interface QuickPostDetailResponse {
  quick_post: QuickPost;
  message?: string;
}
