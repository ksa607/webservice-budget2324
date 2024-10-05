import config from 'config';
import bodyParser from 'koa-bodyparser';
import koaCors from '@koa/cors';
import type { KoaApplication } from '../types/koa';

const CORS_ORIGINS = config.get<string[]>('cors.origins');
const CORS_MAX_AGE = config.get<number>('cors.maxAge');

export default function installMiddlewares(app: KoaApplication) {
  app.use(koaCors({
    origin: (ctx) => {
      if (CORS_ORIGINS.indexOf(ctx.request.header.origin!) !== -1) {
        return ctx.request.header.origin!;
      }
      // Not a valid domain at this point, let's return the first valid as we should return a string
      return CORS_ORIGINS[0] || '';
    },
    allowHeaders: [
      'Accept',
      'Content-Type',
      'Authorization',
    ],
    maxAge: CORS_MAX_AGE,
  }));

  app.use(bodyParser());
}