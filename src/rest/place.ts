import Router from '@koa/router';
import * as transactionService from '../service/transaction';
import type { Context } from 'koa';

const getTransactionsByPlaceId = async (ctx: Context) => {
  const transactions = transactionService.getTransactionsByPlaceId(Number(ctx.params.id));
  ctx.body = {
    items: transactions,
  };
};

export default (parent: Router) => {
  const router = new Router({
    prefix: '/places',
  });

  router.get('/:id/transactions', getTransactionsByPlaceId);

  parent.use(router.routes())
    .use(router.allowedMethods());
};
