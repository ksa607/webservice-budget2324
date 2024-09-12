import { prisma } from '../data';

export const getAll = async () => {
  return prisma.user.findMany();
};

export const getById = async (id: number) => {
  return prisma.user.findUnique({ where: { id } });
};

export const create = async ({ name }: any) => {
  return prisma.user.create({ data: { name } });
};

export const updateById = async (id: number, { name }: any) => {
  return prisma.user.update({
    where: { id },
    data: { name },
  });
};

export const deleteById = async (id: number) => {
  await prisma.user.delete({ where: { id } });
};
