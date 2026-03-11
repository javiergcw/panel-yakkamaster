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

/**
 * Request body for updating labour/user profile (PUT).
 * All fields must be sent; use null for empty values, not omitted.
 */
export interface UpdateLabourProfileSkillReference {
  company_id: string;
  description?: string | null;
}

export interface UpdateLabourProfileSkillItem {
  category_id: string;
  subcategory_id: string;
  experience_level_id: string;
  years_experience: number;
  is_primary: boolean;
  references?: UpdateLabourProfileSkillReference[] | null;
}

export interface UpdateLabourProfileQualificationItem {
  qualification_id: string;
  date_obtained?: string | null;
  expires_at?: string | null;
  status: string;
}

export interface UpdateLabourProfileLicenseItem {
  license_id: string;
  photo_url?: string | null;
  issued_at?: string | null;
  expires_at?: string | null;
}

export interface UpdateLabourProfileRequest {
  first_name: string;
  last_name: string;
  location: string;
  bio: string | null;
  avatar_url: string | null;
  phone: string;
  skills: UpdateLabourProfileSkillItem[] | null;
  qualifications: UpdateLabourProfileQualificationItem[] | null;
  licenses: UpdateLabourProfileLicenseItem[] | null;
  latitude: number;
  longitude: number;
  organizations: string[] | null;
}

/**
 * Builds the full update profile payload. Ensures all keys are sent;
 * empty strings and empty arrays become null (do not omit fields).
 */
export function buildUpdateLabourProfilePayload(
  data: {
    first_name?: string;
    last_name?: string;
    location?: string;
    bio?: string | null;
    avatar_url?: string | null;
    phone?: string;
    skills?: UpdateLabourProfileSkillItem[] | null;
    qualifications?: UpdateLabourProfileQualificationItem[] | null;
    licenses?: UpdateLabourProfileLicenseItem[] | null;
    latitude?: number;
    longitude?: number;
    organizations?: string[] | null;
  }
): UpdateLabourProfileRequest {
  const emptyStr = (v: string | null | undefined) =>
    v === undefined || v === null || String(v).trim() === '' ? null : String(v);
  const emptyArr = <T>(v: T[] | null | undefined): T[] | null =>
    v === undefined || v === null || v.length === 0 ? null : v;
  return {
    first_name: data.first_name ?? '',
    last_name: data.last_name ?? '',
    location: data.location ?? '',
    bio: emptyStr(data.bio),
    avatar_url: emptyStr(data.avatar_url),
    phone: data.phone ?? '',
    skills: emptyArr(data.skills),
    qualifications: emptyArr(data.qualifications),
    licenses: emptyArr(data.licenses),
    latitude: typeof data.latitude === 'number' ? data.latitude : 0,
    longitude: typeof data.longitude === 'number' ? data.longitude : 0,
    organizations: emptyArr(data.organizations),
  };
}
