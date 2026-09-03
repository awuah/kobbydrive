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
  electoral_area?: string;
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
