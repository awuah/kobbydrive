export type ApplicationStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "in_training"
  | "completed"
  | "rejected";

export type GenderType = "Male" | "Female" | "Other";

export type TitleType = "Mr" | "Mrs" | "Miss" | "Ms" | "Dr" | "Rev" | "Other";

export type IdType =
  | "Ghana Card"
  | "National ID"
  | "Passport"
  | "Voter ID"
  | "Driver's License / Permit"
  | "Other";

export type TrainingPurposeType =
  | "Personal"
  | "Commercial Driver"
  | "Agricultural"
  | "Private"
  | "Equipment Handling";

export type TrainingScheduleType =
  | "Early morning 6am to 10am"
  | "Mid morning 10am to 2pm"
  | "Late afternoon 2pm to 6pm"
  | "unscheduled";

export interface CohortSlot {
  id: string; // e.g. "early", "mid", "late"
  label: TrainingScheduleType;
  timeRange: string;
  maxCapacity: number; // 30
  enrolledCount: number;
  applicantIds: string[];
}

export interface TrainingCohort {
  id: string;
  code: string; // e.g. "COHORT-2026-01"
  name: string; // e.g. "Cohort 1 (Sep 21 – Oct 10, 2026)"
  startDate: string; // YYYY-MM-DD (Monday)
  endDate: string; // YYYY-MM-DD (Saturday, 3 weeks later)
  maxCapacity: number; // 90
  status: "upcoming" | "active" | "completed";
  notes?: string;
  slots: {
    early: CohortSlot;
    mid: CohortSlot;
    late: CohortSlot;
  };
  totalEnrolled: number;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  application_number: string;
  surname: string;
  last_name: string;
  gender: GenderType | string;
  title: TitleType | string;
  id_type: IdType | string;
  id_number: string;
  date_of_birth: string;
  place_of_birth: string;
  postal_address: string | null;
  house_number?: string;
  house_address: string;
  nationality: string;
  email: string;
  phone_number: string;
  training_purpose?: TrainingPurposeType | string;
  training_schedule?: TrainingScheduleType | string;
  is_employed?: "Yes" | "No" | string;
  cohort_id?: string | null;
  cohort_name?: string | null;
  cohort_start_date?: string | null;
  cohort_end_date?: string | null;
  electoral_area?: string;
  passport_photo?: string;
  signature_data: string;
  status: ApplicationStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ApplicationLog {
  id: string;
  application_id: string;
  action: string;
  previous_status?: string | null;
  new_status?: string | null;
  notes?: string | null;
  performed_by?: string;
  created_at: string;
}

export interface AdminActivityLog {
  id: string;
  admin_id: string;
  admin_name: string;
  admin_code?: string;
  action: string;
  application_id?: string | null;
  application_number?: string | null;
  candidate_name?: string | null;
  previous_status?: string | null;
  new_status?: string | null;
  notes?: string | null;
  ip_address?: string | null;
  created_at: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  under_review: number;
  approved: number;
  in_training: number;
  completed: number;
  rejected: number;
  todayCount: number;
}


