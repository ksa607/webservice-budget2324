import Router from '@koa/router';
import Joi from 'joi';
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
import validate from '../core/validation';
import { requireAuthentication } from '../core/auth';

const getAllTransactions = async (ctx: KoaContext<GetAllTransactionsReponse>) => {
  ctx.body = {
    items: await transactionService.getAll(
      ctx.state.session.userId,
      ctx.state.session.roles,
    ),
  };
};
getAllTransactions.validationScheme = null;

const createTransaction = async (ctx: KoaContext<CreateTransactionResponse, void, CreateTransactionRequest>) => {
  const newTransaction = await transactionService.create({
    ...ctx.request.body,
    userId: ctx.state.session.userId,
  });
  ctx.status = 201;
  ctx.body = newTransaction;
};
createTransaction.validationScheme = {
  body: {
    amount: Joi.number().invalid(0),
    date: Joi.date().iso().less('now'),
    placeId: Joi.number().integer().positive(),
  },
};

const getTransactionById = async (ctx: KoaContext<GetTransactionByIdResponse, IdParams>) => {
  ctx.body = await transactionService.getById(
    ctx.params.id, 
    ctx.state.session.userId,
    ctx.state.session.roles,
  );
};
getTransactionById.validationScheme = {
  params: {
    id: Joi.alternatives().try(
      Joi.number().integer().positive(),
      Joi.string().valid('me'),
    ),
  },
};

const updateTransaction = async (ctx: KoaContext<UpdateTransactionResponse, IdParams, UpdateTransactionRequest>) => {
  ctx.body = await transactionService.updateById(ctx.params.id, {
    ...ctx.request.body,
    userId: ctx.state.session.userId,
  });
};
updateTransaction.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    amount: Joi.number().invalid(0),
    date: Joi.date().iso().less('now'),
    placeId: Joi.number().integer().positive(),
  },
};

const deleteTransaction = async (ctx: KoaContext<void, IdParams>) => {
  await transactionService.deleteById(ctx.params.id, ctx.state.session.userId);
  ctx.status = 204;
};
deleteTransaction.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<BudgetAppState, BudgetAppContext>({
    prefix: '/transactions',
  });

  router.use(requireAuthentication);

  router.get('/', validate(getAllTransactions.validationScheme), getAllTransactions);
  router.post('/', validate(createTransaction.validationScheme), createTransaction);
  router.get('/:id', validate(getTransactionById.validationScheme), getTransactionById);
  router.put('/:id', validate(updateTransaction.validationScheme), updateTransaction);
  router.delete('/:id', validate(deleteTransaction.validationScheme), deleteTransaction);

  parent.use(router.routes())
    .use(router.allowedMethods());
};
