import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type { User, UserCreateInput, UserUpdateInput, PublicUser } from '../types/user';
import { hashPassword } from '../core/password';
import handleDBError from './_handleDBError';

const makeExposedUser = ({ id, name, email }: User): PublicUser => ({
  id,
  name,
  email,
});

export const getAll = async (): Promise<PublicUser[]> => {
  const users = await prisma.user.findMany();
  return users.map(makeExposedUser);
};

export const getById = async (id: number): Promise<PublicUser> => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw ServiceError.notFound('No user with this id exists');
  }

  return makeExposedUser(user);
};

export const register = async ({
  name,
  email,
  password,
}: UserCreateInput): Promise<PublicUser> => {
  try {
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash: passwordHash,
        roles: ['user'],
      },
    });

    return makeExposedUser(user);
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async (id: number, changes: UserUpdateInput): Promise<PublicUser> => {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: changes,
    });
    return makeExposedUser(user);
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
