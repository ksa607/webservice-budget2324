import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type { User, UserCreateInput, UserUpdateInput, PublicUser } from '../types/user';
import { hashPassword, verifyPassword } from '../core/password';
import { generateJWT } from '../core/jwt'; 
import Role from '../core/roles';
import handleDBError from './_handleDBError';

const makeExposedUser = ({ id, name, email }: User): PublicUser => ({
  id,
  name,
  email,
});

export const login = async (
  email: string,
  password: string,
): Promise<string> => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // DO NOT expose we don't know the user
    throw ServiceError.unauthorized(
      'The given email and password do not match',
    );
  }

  const passwordValid = await verifyPassword(password, user.password_hash);

  if (!passwordValid) {
    // DO NOT expose we know the user but an invalid password was given
    throw ServiceError.unauthorized(
      'The given email and password do not match',
    );
  }

  return await generateJWT(user);
};

export const register = async ({
  name,
  email,
  password,
}: UserCreateInput): Promise<string> => {
  try {
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash: passwordHash,
        roles: [Role.USER],
      },
    });

    return await generateJWT(user);
  } catch (error) {
    throw handleDBError(error);
  }
};

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
