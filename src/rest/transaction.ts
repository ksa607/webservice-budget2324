import Router from '@koa/router';
import * as transactionService from '../service/transaction';
import type { BudgetAppContext, BudgetAppState} from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreateTransactionRequest,
  CreateTransactionResponse,
  GetAllTransactionsReponse,
  GetTransactionByIdResponse,
  UpdateTransactionRequest,
  UpdateTransactionResponse,
} from '../types/transaction';
import type { IdParams } from '../types/common';

const getAllTransactions = async (ctx: KoaContext<GetAllTransactionsReponse>) => {
  ctx.body = {
    items: await transactionService.getAll(),
  };
};

const createTransaction = async (ctx: KoaContext<CreateTransactionResponse, void, CreateTransactionRequest>) => {
  const newTransaction = await transactionService.create({
    ...ctx.request.body,
    placeId: Number(ctx.request.body.placeId),
    userId: Number(ctx.request.body.userId),
    date: new Date(ctx.request.body.date),
  });
  ctx.body = newTransaction;
};

const getTransactionById = async (ctx: KoaContext<GetTransactionByIdResponse, IdParams>) => {
  ctx.body = await transactionService.getById(Number(ctx.params.id));
};

const updateTransaction = async (ctx: KoaContext<UpdateTransactionResponse, IdParams, UpdateTransactionRequest>) => {
  ctx.body = await transactionService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    placeId: Number(ctx.request.body.placeId),
    userId: Number(ctx.request.body.userId),
    date: new Date(ctx.request.body.date),
  });
};

const deleteTransaction = async (ctx: KoaContext<void, IdParams>) => {
  await transactionService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

export default (parent: KoaRouter) => {
  const router = new Router<BudgetAppState, BudgetAppContext>({
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
