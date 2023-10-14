import { UserRole } from '@prisma/client';

export type IUser = {
  name: string;
  email: string;
  role: UserRole;
  contactNo: string;
  address: string;
  id: string;
  profileImg: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IUserFilters = {
  searchTerm?: string;
  name?: string;
  email?: string;
  role?: string;
  contactNo?: string;
  address?: string;
};
