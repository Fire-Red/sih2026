export type UserRole =
  | 'citizen'
  | 'student'
  | 'government'
  | 'institution'
  | 'industry'
  | 'admin';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
}
