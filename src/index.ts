import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import config from 'config';
import koaCors from '@koa/cors';
import { getLogger } from './core/logging';
import installRest from './rest';
import { initializeData } from './data';
import type { BudgetAppContext, BudgetAppState } from './types/koa';

const CORS_ORIGINS = config.get<string[]>('cors.origins');
const CORS_MAX_AGE = config.get<number>('cors.maxAge');

async function main(): Promise<void> {
  const app = new Koa<BudgetAppState, BudgetAppContext>();

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

  initializeData();
  installRest(app);

  app.listen(9000, () => {
    getLogger().info('🚀 Server listening on http://127.0.0.1:9000');
  });
}
main();