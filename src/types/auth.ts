export interface User {
  id: string
  name: string
  email: string
  phone?: string
  department?: string
  role: string
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  created_at: string;
}