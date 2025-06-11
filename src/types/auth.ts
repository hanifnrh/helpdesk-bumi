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

export interface UserFormData {
  email: string;
  name: string;
  phone: string; // Phone number with +62 code
  role: 'admin' | 'user';
}
