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
      name: 'Loon',
      rating: 3,
    },
    {
      id: 2,
      name: 'Benzine',
      rating: 2,
    }, {
      id: 3,
      name: 'Irish pub',
      rating: 4,
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
  places: [1, 2, 3],
  users: [1],
};

describe('Places', () => {
  let server: Server;
  let request: supertest.Agent;

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
  });

  afterAll(async () => {
    await server.stop();
  });

  const url = '/api/places';

  describe('GET /api/places', () => {

    beforeAll(async () => {
      await prisma.place.createMany({ data: data.places });
    });

    afterAll(async () => {
      await prisma.place.deleteMany({ where: { id: { in: dataToDelete.places } } });
    });

    it('should 200 and return all places', async () => {
      const response = await request.get(url);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(3);
      expect(response.body.items).toEqual(expect.arrayContaining([{
        id: 2,
        name: 'Benzine',
        rating: 2,
      }, {
        id: 3,
        name: 'Irish pub',
        rating: 4,
      }]));
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
  });

  describe('GET /api/places/:id', () => {

    beforeAll(async () => {
      await prisma.place.createMany({ data: data.places });
    });

    afterAll(async () => {
      await prisma.place.deleteMany({ where: { id: { in: dataToDelete.places } } });
    });

    it('should 200 and return the requested place', async () => {
      const response = await request.get(`${url}/1`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        name: 'Loon',
        rating: 3,
        transactions: [],
      });
    });

    it('should 404 when requesting not existing place', async () => {
      const response = await request.get(`${url}/200`);

      expect(response.statusCode).toBe(404);

      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No place with this id exists',
      });

      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid place id', async () => {
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });

  describe('POST /api/places', () => {

    const placesToDelete: number[] = [];

    afterAll(async () => {
      await prisma.place.deleteMany({ where: { id: { in: placesToDelete } } });
    });

    it('should 201 and return the created place', async () => {
      const response = await request.post(url)
        .send({
          name: 'Lovely place',
          rating: 5,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toBe('Lovely place');
      expect(response.body.rating).toBe(5);

      placesToDelete.push(response.body.id);
    });

    it('should 400 for duplicate place name', async () => {
      const response = await request.post(url)
        .send({ name: 'Lovely place' });

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        code: 'VALIDATION_FAILED',
        message: 'A place with this name already exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when missing name', async () => {
      const response = await request.post(url)
        .send({ rating: 3 });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('name');
    });

    it('should 400 when rating lower than one', async () => {
      const response = await request.post(url)
        .send({
          name: 'The wrong place',
          rating: 0,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('rating');
    });

    it('should 400 when rating higher than five', async () => {
      const response = await request.post(url)
        .send({
          name: 'The wrong place',
          rating: 6,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('rating');
    });

    it('should 400 when rating is a decimal', async () => {
      const response = await request.post(url)
        .send({
          name: 'The wrong place',
          rating: 3.5,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('rating');
    });
  });

  describe('PUT /api/places/:id', () => {

    beforeAll(async () => {
      await prisma.place.createMany({ data: data.places });
    });

    afterAll(async () => {
      await prisma.place.deleteMany({ where: { id: { in: dataToDelete.places } } });
    });

    it('should 200 and return the updated place', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          name: 'Changed name',
          rating: 1,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        name: 'Changed name',
        rating: 1,
      });
    });

    it('should 400 for duplicate place name', async () => {
      const response = await request.put(`${url}/2`)
        .send({
          name: 'Changed name',
          rating: 1,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        code: 'VALIDATION_FAILED',
        message: 'A place with this name already exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when missing name', async () => {
      const response = await request.put(`${url}/1`)
        .send({ rating: 3 });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('name');
    });

    it('should 400 when missing rating', async () => {
      const response = await request.put(`${url}/1`)
        .send({ name: 'The name' });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('rating');
    });

    it('should 400 when rating lower than one', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          name: 'The wrong place',
          rating: 0,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('rating');
    });

    it('should 400 when rating higher than five', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          name: 'The wrong place',
          rating: 6,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('rating');
    });

    it('should 400 when rating is a decimal', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          name: 'The wrong place',
          rating: 3.5,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('rating');
    });
  });

  describe('DELETE /api/places/:id', () => {

    beforeAll(async () => {
      await prisma.place.create({ data: data.places[0]! });
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing place', async () => {
      const response = await request.delete(`${url}/200`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No place with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid place id', async () => {
      const response = await request.delete(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });

  describe('GET /api/places/:id/transactions', () => {

    beforeAll(async () => {
      await prisma.place.createMany({ data: data.places });
      await prisma.user.createMany({ data: data.users });
      await prisma.transaction.createMany({ data: data.transactions });
    });

    afterAll(async () => {
      await prisma.transaction.deleteMany({ where: { id: { in: dataToDelete.transactions } } });
      await prisma.place.deleteMany({ where: { id: { in: dataToDelete.places } } });
      await prisma.user.deleteMany({ where: { id: { in: dataToDelete.users } } });
    });

    it('should 200 and return the transaction of the given place', async () => {
      const response = await request.get(`${url}/1/transactions`);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(3);
      expect(response.body.items).toEqual(expect.arrayContaining([{
        id: 2,
        amount: -220,
        date: '2021-05-08T18:00:00.000Z',
        place: {
          id: 1,
          name: 'Loon',
          rating: 3,
        },
        user: {
          id: 1,
          name: 'Test User',
        },
      }, {
        id: 3,
        amount: -74,
        date: '2021-05-21T12:30:00.000Z',
        place: {
          id: 1,
          name: 'Loon',
          rating: 3,
        },
        user: {
          id: 1,
          name: 'Test User',
        },
      }]));
    });

    it('should 400 with invalid place id', async () => {
      const response = await request.get(`${url}/invalid/transactions`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });
});
