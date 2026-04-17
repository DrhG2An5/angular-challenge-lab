export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'developer' | 'viewer';
