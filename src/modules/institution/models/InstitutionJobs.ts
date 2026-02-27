/**
 * Models for GET /api/v1/institution/jobs
 */

export interface JobLicense {
  id: string;
  job_id: string;
  license_id: string;
  created_at: string;
}

export interface JobSkill {
  id: string;
  job_id: string;
  skill_category_id: string;
  skill_subcategory_id: string;
  created_at: string;
}

export interface Job {
  id: string;
  builder_profile_id: string;
  jobsite_id: string;
  job_type_id: string;
  many_labours: number;
  ongoing_work: boolean;
  ongoing_frequency: string;
  wage_site_allowance: number;
  wage_leading_hand_allowance: number;
  wage_productivity_allowance: number;
  extras_overtime_rate: number;
  wage_hourly_rate: number;
  wage_meal: number;
  travel_allowance: number;
  gst: number;
  start_date_work: string;
  end_date_work: string;
  closing_date: string;
  work_saturday: boolean;
  work_sunday: boolean;
  start_time: string;
  end_time: string;
  description: string;
  payment_day: string;
  requires_supervisor_signature: boolean;
  supervisor_name: string;
  visibility: string;
  asap: boolean;
  behalf_company: boolean;
  pay_type_id: string;
  location_without_company: string;
  institution_id: string;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  job_licenses: JobLicense[];
  job_skills: JobSkill[];
}

export interface JobsResponse {
  count: number;
  jobs: Job[];
  message: string;
}
