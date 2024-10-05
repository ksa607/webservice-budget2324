import supertest from 'supertest';
import createServer from '../../src/createServer';
import type { Server } from '../../src/createServer';
import { prisma } from '../../src/data';

const data = {
  users: [
    {
      id: 1,
      name: 'User One',
    },
    {
      id: 2,
      name: 'User Two',
    },
    {
      id: 3,
      name: 'User Three',
    }
  ],
};

const dataToDelete = {
  users: [1, 2, 3],
};

describe('Users', () => {

  let server: Server;
  let request: supertest.Agent;

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
  });

  afterAll(async () => {
    await server.stop();
  });

  const url = '/api/users';

  describe('GET /api/users', () => {

    beforeAll(async () => {
      await prisma.user.createMany({ data: data.users });
    });

    afterAll(async () => {
      await prisma.user.deleteMany({ where: { id: { in: dataToDelete.users } } });
    });

    it('should 200 and return all users', async () => {
      const response = await request.get(url);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(3);
      expect(response.body.items).toEqual(expect.arrayContaining([{
        id: 1,
        name: 'User One',
      }, {
        id: 3,
        name: 'User Three',
      }]));
    });
  });

  describe('GET /api/user/:id', () => {

    beforeAll(async () => {
      await prisma.user.create({ data: data.users[0]! });
    });

    afterAll(async () => {
      await prisma.user.delete({ where: { id: data.users[0]!.id } });
    });

    it('should 200 and return the requested user', async () => {
      const response = await request.get(`${url}/1`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        name: 'User One',
      });
    });
  });

  describe('POST /api/users', () => {

    const usersToDelete: number[] = [];

    afterAll(async () => {
      await prisma.user.deleteMany({
        where: {
          id: { in: usersToDelete },
        },
      });
    });

    it('should 200 and return the registered user', async () => {
      const response = await request.post(url)
        .send({
          name: 'New User',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toBe('New User');

      usersToDelete.push(response.body.id);
    });
  });

  describe('PUT /api/users/:id', () => {

    beforeAll(async () => {
      await prisma.user.create({ data: data.users[0]! });
    });

    afterAll(async () => {
      // Delete the updated user
      await prisma.user.delete({ where: { id: data.users[0]!.id } });
    });

    it('should 200 and return the updated user', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          name: 'Changed name',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        name: 'Changed name',
      });
    });
  });

  describe('DELETE /api/users/:id', () => {


    beforeAll(async () => {
      await prisma.user.create({ data: data.users[0]! });
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});
