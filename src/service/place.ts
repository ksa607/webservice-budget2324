import { prisma } from '../data';

export const getAll = async () => {
  return prisma.place.findMany();
};

export const getById = async (id: number) => {
  return prisma.place.findUnique({
    where: {
      id,
    },
  });
};

export const create = async ({ name, rating }: any) => {
  return prisma.place.create({
    data: {
      name,
      rating,
    },
  });
};

export const updateById = async (id: number, { name, rating }: any) => {
  return prisma.place.update({
    where: {
      id,
    },
    data: {
      name,
      rating,
    },
  });
};

export const deleteById = async (id: number) => {
  await prisma.place.delete({
    where: {
      id,
    },
  });
};