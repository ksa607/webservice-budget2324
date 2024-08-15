import type Application from 'koa';

import Router from '@koa/router';
import installTransactionRouter from './transaction';
import installHealthRouter from './health';

export default (app: Application) => {
  const router = new Router({
    prefix: '/api',
  });

  installTransactionRouter(router);
  installHealthRouter(router);

  app.use(router.routes())
    .use(router.allowedMethods());
};