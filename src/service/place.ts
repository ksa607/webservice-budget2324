import { PLACES } from '../data/mock_data';

export const getAll = () => {
  return PLACES;
};

export const getById = (id: number) => {
  return PLACES.find((t) => t.id === id);
};

export const create = ({ name, rating }: any) => {
  const maxId = Math.max(...PLACES.map((i) => i.id));

  const newPlace = {
    id: maxId + 1,
    name,
    rating,
  };
  PLACES.push(newPlace);
  return newPlace;
};

export const updateById = (id: number, { name, rating }: any) => {
  const index = PLACES.findIndex((t) => t.id === id);
  const updatedPlace = {
    ...PLACES[index],
    name,
    rating,
  };
  PLACES[index] = updatedPlace;
  return updatedPlace;
};

export const deleteById = (id: number) => {
  const index = PLACES.findIndex((t) => t.id === id);
  PLACES.splice(index, 1);
};