import { prisma } from '../data';
import type { Place, PlaceCreateInput, PlaceUpdateInput } from '../types/place';

export const getAll = async (): Promise<Place[]> => {
  return prisma.place.findMany();
};

export const getById = async (id: number): Promise<Place | null> => {
  return prisma.place.findUnique({
    where: {
      id,
    },
  });
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