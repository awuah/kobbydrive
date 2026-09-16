export type AttendanceStatus = "present" | "late" | "absent" | "excused";

export interface TraineeAttendanceRecord {
  id: string;
  applicationId: string;
  candidateName: string;
  applicationNumber: string;
  phone: string;
  date: string; // YYYY-MM-DD
  shift: string; // "Early morning 6am to 10am" | "Mid morning 10am to 2pm" | "Late afternoon 2pm to 6pm"
  status: AttendanceStatus;
  markedBy: string;
  notes?: string;
  created_at: string;
}

export type TestVerdict = "passed" | "remedial" | "failed";

export interface MockTestAssessment {
  id: string;
  applicationId: string;
  candidateName: string;
  applicationNumber: string;
  phone: string;
  electoralArea: string;
  testDate: string; // YYYY-MM-DD
  theoryScore: number; // Max 50
  parkingManeuvers: "Pass" | "Fail";
  roadDrivingScore: number; // Max 50
  overallVerdict: TestVerdict;
  examinerName: string;
  remarks: string;
  isEligibleForCertificate: boolean;
  created_at: string;
}

export interface FuelVehicleLog {
  id: string;
  date: string; // YYYY-MM-DD
  vehicleRegNumber: string; // e.g. "WR 4821-26"
  driverInstructorName: string;
  litresPurchased: number;
  amountGHS: number;
  odometerKm: number;
  fuelStation: string;
  receiptNumber: string;
  notes?: string;
  loggedBy: string;
  created_at: string;
}

export interface InstructorAttendance {
  id: string;
  date: string;
  instructorName: string;
  shift: string;
  assignedVehicle: string;
  status: "present" | "absent" | "half_day";
  notes?: string;
  created_at: string;
}

export interface ProvisionalCertificate {
  id: string;
  certificateNumber: string; // e.g. "KBD-CERT-2026-0042"
  applicationId: string;
  applicationNumber: string;
  candidateName: string;
  electoralArea: string;
  idNumber: string;
  completionDate: string;
  issueDate: string;
  trainingPurpose: string;
  trainingSchedule: string;
  instructorName: string;
  status: "issued" | "revoked";
  created_at: string;
}
