import Router from '@koa/router';
import installTransactionRouter from './transaction';
import installHealthRouter from './health';
import installPlacesRouter from './place';
import installUserRouter from './user';
import installSessionRouter from './session';
import type { BudgetAppContext, BudgetAppState, KoaApplication } from '../types/koa';

export default (app: KoaApplication) => {
  const router = new Router<BudgetAppState, BudgetAppContext>({
    prefix: '/api',
  });

  installTransactionRouter(router);
  installHealthRouter(router);
  installPlacesRouter(router);
  installUserRouter(router);
  installSessionRouter(router);

  app.use(router.routes())
    .use(router.allowedMethods());
};