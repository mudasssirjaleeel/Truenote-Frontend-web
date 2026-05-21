export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string | null;
  role: "user" | "admin" | "staff";
  roleName?: string;
  permissions?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}
