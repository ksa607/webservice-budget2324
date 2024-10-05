import { prisma } from '../data';
import type { Transaction, TransactionCreateInput, TransactionUpdateInput } from '../types/transaction';
import * as placeService from './place';

const TRANSACTION_SELECT = {
  id: true,
  amount: true,
  date: true,
  place: true,
  user: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const getAll = async (): Promise<Transaction[]> => {
  return prisma.transaction.findMany({
    select: TRANSACTION_SELECT,
  });
};

export const getById = async (id: number): Promise<Transaction> => {
  const transaction = await prisma.transaction.findUnique({
    where: {
      id,
    },
    select: TRANSACTION_SELECT,
  });

  if (!transaction) {
    throw new Error('No transaction with this id exists');
  }

  return transaction;
};

export const create = async ({
  amount,
  date,
  placeId,
  userId,
}: TransactionCreateInput): Promise<Transaction> => {
  const existingPlace = await placeService.getById(placeId);

  if (!existingPlace) {
    throw new Error(`There is no place with id ${placeId}.`);
  }

  return prisma.transaction.create({
    data: {
      amount,
      date,
      user_id: userId,
      place_id: placeId,
    },
    select: TRANSACTION_SELECT,
  });
};

export const updateById = async (id: number, {
  amount,
  date,
  placeId,
  userId,
}: TransactionUpdateInput): Promise<Transaction> => {
  const existingPlace = await placeService.getById(placeId);

  if (!existingPlace) {
    throw new Error(`There is no place with id ${placeId}.`);
  }

  return prisma.transaction.update({
    where: {
      id,
      user_id: userId,
    },
    data: {
      amount,
      date,
      place_id: placeId,
    },
    select: TRANSACTION_SELECT,
  });
};

export const deleteById = async (id: number): Promise<void> => {
  await prisma.transaction.delete({
    where: {
      id,
    },
  });
};

export const getTransactionsByPlaceId = async (placeId: number): Promise<Transaction[]> => {
  return prisma.transaction.findMany({
    where: {
      AND: [
        { place_id: placeId },
      ],
    },
    select: TRANSACTION_SELECT,
  });
};
