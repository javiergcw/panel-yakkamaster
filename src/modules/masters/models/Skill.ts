/**
 * GET /api/v1/skills
 */
export interface SkillSubcategory {
  id: string;
  name: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  subcategories: SkillSubcategory[];
}

export interface SkillsResponse {
  data: Skill[];
  message?: string;
  success?: boolean;
}
