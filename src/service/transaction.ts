import { TRANSACTIONS, PLACES } from '../data/mock_data';

export const getAll = () => {
  return TRANSACTIONS;
};

export const getById = (id: number) => {
  return TRANSACTIONS.find((t) => t.id === id);
};

export const create = ({ amount, date, placeId, user }: any) => {
  const existingPlace = PLACES.find((place) => place.id === placeId);

  if (!existingPlace) {
    throw new Error(`There is no place with id ${placeId}.`);
  }

  const maxId = Math.max(...TRANSACTIONS.map((i) => i.id));

  const newTransaction = {
    id: maxId + 1,
    amount,
    date: date.toISOString(),
    place: existingPlace,
    user: { id: Math.floor(Math.random() * 100000), name: user },
  };
  TRANSACTIONS.push(newTransaction);
  return newTransaction;
};

export const updateById = (id: number, { amount, date, placeId, user }: any) => {
  const index = TRANSACTIONS.findIndex((t) => t.id === id);
  const existingPlace = PLACES.find((place) => place.id === placeId);

  if (!existingPlace) {
    throw new Error(`There is no place with id ${placeId}.`);
  }

  const updatedTransaction = {
    ...TRANSACTIONS[index],
    amount,
    date: date.toISOString(),
    place: existingPlace,
    user: { id: TRANSACTIONS[index].user.id, name: user },
  };
  TRANSACTIONS[index] = updatedTransaction;
  return updatedTransaction;
};

export const deleteById = (id: number) => {
  const index = TRANSACTIONS.findIndex((t) => t.id === id);
  TRANSACTIONS.splice(index, 1);
};
