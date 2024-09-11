import Router from '@koa/router';
import * as transactionService from '../service/transaction';
import type { Context } from 'koa';

const getAllTransactions = async (ctx: Context) => {
  ctx.body = {
    items: await transactionService.getAll(),
  };
};

const createTransaction = async (ctx: Context) => {
  const newTransaction = await transactionService.create({
    ...ctx.request.body,
    placeId: Number(ctx.request.body.placeId),
    userId: Number(ctx.request.body.userId),
    date: new Date(ctx.request.body.date),
  });
  ctx.body = newTransaction;
};

const getTransactionById = async (ctx: Context) => {
  ctx.body = await transactionService.getById(Number(ctx.params.id));
};

const updateTransaction = async (ctx: Context) => {
  ctx.body = await transactionService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    placeId: Number(ctx.request.body.placeId),
    userId: Number(ctx.request.body.userId),
    date: new Date(ctx.request.body.date),
  });
};

const deleteTransaction = async (ctx: Context) => {
  await transactionService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

export default (parent: Router) => {
  const router = new Router({
    prefix: '/transactions',
  });

  router.get('/', getAllTransactions);
  router.post('/', createTransaction);
  router.get('/:id', getTransactionById);
  router.put('/:id', updateTransaction);
  router.delete('/:id', deleteTransaction);

  parent.use(router.routes())
    .use(router.allowedMethods());
};
