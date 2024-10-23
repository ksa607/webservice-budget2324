import type { Prisma } from '@prisma/client';
import type { Entity, ListResponse } from './common';

export interface User extends Entity {
  name: string;
  email: string;
  password_hash: string;
  roles: Prisma.JsonValue;
}

export interface UserCreateInput {
  name: string;
}

export interface UserUpdateInput extends UserCreateInput {}

export interface CreateUserRequest {
  name: string;
}
export interface UpdateUserRequest extends CreateUserRequest {}

export interface GetAllUsersResponse extends ListResponse<User> {}
export interface GetUserByIdResponse extends User {}
export interface CreateUserResponse extends GetUserByIdResponse {}
export interface UpdateUserResponse extends GetUserByIdResponse {}
