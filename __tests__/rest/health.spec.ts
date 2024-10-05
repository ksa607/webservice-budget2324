import supertest from 'supertest';
import createServer from '../../src/createServer';
import type { Server } from '../../src/createServer';
import packageJson from '../../package.json';

describe('Health', () => {

  let server: Server;
  let request: supertest.Agent;

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
  });

  afterAll(async () => {
    await server.stop();
  });

  describe('GET /api/health/ping', () => {
    const url = '/api/health/ping';

    it('should return pong', async () => {
      const response = await request.get(url);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ pong: true });
    });
  });

  describe('GET /api/health/version', () => {
    const url = '/api/health/version';

    it('should return version from package.json', async () => {
      const response = await request.get(url);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        env: 'testing',
        version: packageJson.version,
        name: packageJson.name,
      });
    });
  });
});
