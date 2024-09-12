import Router from '@koa/router';
import installTransactionRouter from './transaction';
import installHealthRouter from './health';
import installPlacesRoutes from './place';
import installUserRoutes from './user';
import type { BudgetAppContext, BudgetAppState, KoaApplication } from '../types/koa';

export default (app: KoaApplication) => {
  const router = new Router<BudgetAppState, BudgetAppContext>({
    prefix: '/api',
  });

  installTransactionRouter(router);
  installHealthRouter(router);
  installPlacesRoutes(router);
  installUserRoutes(router);

  app.use(router.routes())
    .use(router.allowedMethods());
};