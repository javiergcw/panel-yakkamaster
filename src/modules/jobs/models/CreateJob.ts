/**
 * POST /api/v1/institution/jobs
 */
export interface CreateJobSkillItem {
  skill_category_id: string;
  skill_subcategory_id: string;
}

export interface CreateJobRequest {
  jobsite_id: string;
  job_type_id: string;
  many_labours: number;
  ongoing_work: boolean;
  ongoing_frequency: 'WEEKLY' | 'FORTNIGHTLY' | 'MONTHLY';
  wage_site_allowance: number;
  wage_leading_hand_allowance: number;
  wage_productivity_allowance: number;
  wage_hourly_rate: number;
  wage_meal: number;
  travel_allowance: number;
  gst: number;
  extras_overtime_rate: number;
  start_date_work: string;
  end_date_work: string;
  work_saturday: boolean;
  work_sunday: boolean;
  start_time: string;
  end_time: string;
  description: string;
  payment_day: string;
  requires_supervisor_signature: boolean;
  supervisor_name: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  pay_type_id: string;
  license_ids: string[];
  asap: boolean;
  job_skills: CreateJobSkillItem[];
  job_requirement_ids: string[];
  qualification_ids: string[];
  pack_files: string[];
  closing_date: string;
  behalf_company: boolean;
  location_without_company: string | null;
}
