export type UserRole = "admin" | "user";

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  phone: string;
  businessName: string;
  industry: string;
  url: string;
  businessNumber: string;
  address: string;
  role: UserRole;
  createdAt: string;
}

export type UserRegisterInput = Omit<User, "id" | "createdAt" | "role">;
