import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type { User, UserCreateInput, UserUpdateInput } from '../types/user';
import handleDBError from './_handleDBError';

export const getAll = async (): Promise<User[]> => {
  return prisma.user.findMany();
};

export const getById = async (id: number): Promise<User> => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw ServiceError.notFound('No user with this id exists');
  }

  return user;
};

export const create = async ({ name }: UserCreateInput): Promise<User> => {
  try {
    return await prisma.user.create({ data: { name } });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async (id: number, { name }: UserUpdateInput): Promise<User> => {
  try {
    return await prisma.user.update({
      where: { id },
      data: { name },
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  try {
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    throw handleDBError(error);
  }
};
