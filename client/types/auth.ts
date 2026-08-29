export type UserRole =
  | "citizen"
  | "student"
  | "government"
  | "institution"
  | "admin";

export interface GeoLocationContext {
  state: string;
  district: string;
  pinCode: string;
  latitude?: string | null;
  longitude?: string | null;
  formattedAddress?: string | null;
}

export interface GovernmentProfileData {
  department: string;
  designation: string;
  jurisdiction?: string | null;
  employeeId?: string | null;
  officialEmail?: string | null;
}

export interface StudentProfileData {
  institutionName: string;
  aisheCode?: string | null;
  department: string;
  yearOfStudy?: number | null;
  enrollmentNumber?: string | null;
  skills?: string[] | null;
  interests?: string[] | null;
  portfolioUrl?: string | null;
}

export interface InstitutionProfileData {
  institutionName: string;
  aisheCode?: string | null;
  institutionType?: string | null;
  departments?: string[] | null;
  website?: string | null;
  officialEmail?: string | null;
  accreditationStatus?: string | null;
}

export interface IndustryProfileData {
  organizationName: string;
  organizationType?: string | null;
  sector?: string | null;
  website?: string | null;
  csrFocus?: string | null;
  contactPersonDesignation?: string | null;
}

export interface UserProfile {
  id?: string;
  firebaseUid: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  avatarUrl?: string | null;
  phone?: string | null;
  geoContext: GeoLocationContext;
  isOnboarded: boolean;
  roleProfile?:
    | GovernmentProfileData
    | StudentProfileData
    | InstitutionProfileData
    | IndustryProfileData
    | null;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
}
