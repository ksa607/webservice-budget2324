import supertest from 'supertest';
import createServer from '../../src/createServer';
import type { Server } from '../../src/createServer';
import { prisma } from '../../src/data';

const data = {
  transactions: [
    {
      id: 1,
      user_id: 1,
      place_id: 1,
      amount: 3500,
      date: new Date(2021, 4, 25, 19, 40),
    },
    {
      id: 2,
      user_id: 1,
      place_id: 1,
      amount: -220,
      date: new Date(2021, 4, 8, 20, 0),
    },
    {
      id: 3,
      user_id: 1,
      place_id: 1,
      amount: -74,
      date: new Date(2021, 4, 21, 14, 30),
    },
  ],
  places: [
    {
      id: 1,
      name: 'Test place',
      rating: 3,
    },
  ],
  users: [
    {
      id: 1,
      name: 'Test User',
    },
  ],
};

const dataToDelete = {
  transactions: [1, 2, 3],
  places: [1],
  users: [1],
};

describe('Transactions', () => {
  let server: Server;
  let request: supertest.Agent;

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
  });

  afterAll(async () => {
    await server.stop();
  });

  const url = '/api/transactions';

  describe('GET /api/transactions', () => {
    beforeAll(async () => {
      await prisma.place.createMany({ data: data.places });
      await prisma.user.createMany({ data: data.users });
      await prisma.transaction.createMany({ data: data.transactions });
    });

    afterAll(async () => {
      await prisma.transaction.deleteMany({
        where: { id: { in: dataToDelete.transactions } },
      });
      await prisma.place.deleteMany({
        where: { id: { in: dataToDelete.places } },
      });
      await prisma.user.deleteMany({
        where: { id: { in: dataToDelete.users } },
      });
    });

    it('should 200 and return all transactions', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);

      expect(response.body.items).toEqual(
        expect.arrayContaining([
          {
            id: 2,
            user: {
              id: 1,
              name: 'Test User',
            },
            place: {
              id: 1,
              name: 'Test place',
              rating: 3,
            },
            amount: -220,
            date: new Date(2021, 4, 8, 20, 0).toJSON(),
          },
          {
            id: 3,
            user: {
              id: 1,
              name: 'Test User',
            },
            place: {
              id: 1,
              name: 'Test place',
              rating: 3,
            },
            amount: -74,
            date: new Date(2021, 4, 21, 14, 30).toJSON(),
          },
        ]),
      );
    });
  });
});
