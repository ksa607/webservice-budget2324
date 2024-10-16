import { prisma } from '../data';
import type { Place, PlaceCreateInput, PlaceUpdateInput } from '../types/place';

export const getAll = async (): Promise<Place[]> => {
  return prisma.place.findMany();
};

export const getById = async (id: number): Promise<Place> => {
  const place = await prisma.place.findUnique({
    where: {
      id,
    }, include: {
      transactions: {
        select: {
          id: true,
          amount: true,
          date: true,
          place: true,
          user: true,
        },
      },
    },
  });

  if (!place) {
    throw new Error('No place with this id exists');
  }

  return place;
};

export const create = async (place: PlaceCreateInput): Promise<Place> => {
  return prisma.place.create({
    data: place,
  });
};

export const updateById = async (id: number, changes: PlaceUpdateInput): Promise<Place> => {
  return prisma.place.update({
    where: {
      id,
    },
    data: changes,
  });
};

export const deleteById = async (id: number) => {
  await prisma.place.delete({
    where: {
      id,
    },
  });
};

export const checkPlaceExists = async (id: number) => {
  const count = await prisma.place.count({
    where: {
      id,
    },
  });

  if (count === 0) {
    throw new Error('No place with this id exists');
  }
};