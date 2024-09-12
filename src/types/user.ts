import type { Entity } from './common';

export interface User extends Entity {
  name: string;
}

export interface UserCreateInput {
  name: string;
}

export interface UserUpdateInput extends UserCreateInput {}
