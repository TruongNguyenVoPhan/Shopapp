import { Role } from "./role";

export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  active: boolean;
  dateOfBirth: Date;
  facebookAccountId: number;
  googleAccountId: number;
  role: Role;
}