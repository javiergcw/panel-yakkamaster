/**
 * Models for GET /api/v1/institution/builders/:user_id
 * and GET /api/v1/institution/labours/:user_id
 */

/** Builder detail: GET /api/v1/institution/builders/:user_id */
export interface BuilderOrganization {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  website: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BuilderDetailResponse {
  id: string;
  user_id: string;
  name: string;
  photo: string | null;
  display_name: string;
  email: string;
  organizations: BuilderOrganization[];
}

/** Labour detail: GET /api/v1/institution/labours/:user_id */
export interface LabourDetailUser {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  address: string | null;
  photo: string | null;
  link_instagram: string | null;
  link_linkedin: string | null;
  status: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface LabourDetailProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  location: string;
  bio: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface LabourSkillCategory {
  id: string;
  name: string;
}

export interface LabourSkillSubcategory {
  id: string;
  name: string;
}

export interface LabourSkillExperienceLevel {
  id: string;
  name: string;
}

export interface LabourSkill {
  id: string;
  category_id: string;
  subcategory_id: string;
  experience_level_id: string;
  years_experience: number;
  is_primary: boolean;
  category: LabourSkillCategory;
  subcategory: LabourSkillSubcategory;
  experience_level: LabourSkillExperienceLevel;
  created_at: string;
  updated_at: string;
}

export interface LabourQualification {
  id: string;
  qualification_id: string;
  title: string;
  organization: string;
  country: string;
  sport: string;
  status: string;
}

export interface LabourDocumentLicense {
  id: string;
  name: string;
  description: string;
}

export interface LabourDocument {
  id: string;
  license_id: string;
  license: LabourDocumentLicense;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface LabourDetailResponse {
  user: LabourDetailUser;
  profile: LabourDetailProfile;
  skills: LabourSkill[] | null;
  qualifications: LabourQualification[] | null;
  documents: LabourDocument[] | null;
}

/** Body for PUT .../labours/:user_id/verification and PUT .../builders/:user_id/verification */
export interface UpdateVerificationRequest {
  verification_status: 'verified' | 'not_verified' | 'pending';
}

/** Response for both labour and builder verification update */
export interface UpdateVerificationResponse {
  message: string;
}

/**
 * Organization detail: GET /api/v1/institution/organization
 */
export interface OrganizationDetailResponse {
  id: string;
  name: string;
  description: string;
  website: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Institution profile: GET /api/v1/institution/profile
 */
export interface InstitutionProfileUser {
  id: string;
  email: string;
  status: string;
  role: string;
  created_at: string;
  updated_at: string;
}

/** Company object when present in institution profile response */
export interface InstitutionProfileCompany {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  security_code?: string;
}

export interface InstitutionProfileResponse {
  user: InstitutionProfileUser;
  id: string;
  user_id: string;
  organization_id: string;
  organization_name: string;
  company_id: string | null;
  company: InstitutionProfileCompany | null;
  created_at: string;
  updated_at: string;
}

/** Body for PUT /api/v1/institution/profile (assign company) */
export interface UpdateProfileRequest {
  company_id: string;
}
