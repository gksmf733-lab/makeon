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
  createdAt: string;
}

export type UserRegisterInput = Omit<User, "id" | "createdAt">;
