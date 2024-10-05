import { prisma } from '../data';
import type { User, UserCreateInput, UserUpdateInput } from '../types/user';

export const getAll = async (): Promise<User[]> => {
  return prisma.user.findMany();
};

export const getById = async (id: number): Promise<User> => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new Error('No user with this id exists');
  }

  return user;
};

export const create = async ({ name }: UserCreateInput): Promise<User> => {
  return prisma.user.create({ data: { name } });
};

export const updateById = async (id: number, { name }: UserUpdateInput): Promise<User> => {
  return prisma.user.update({
    where: { id },
    data: { name },
  });
};

export const deleteById = async (id: number): Promise<void> => {
  await prisma.user.delete({ where: { id } });
};
