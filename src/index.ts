import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from '@koa/router';
import { getLogger } from './core/logging';
import * as transactionService from './service/transaction';

const app = new Koa();

app.use(bodyParser());

const router = new Router();

router.get('/api/transactions', async (ctx) => {
  ctx.body = {
    items: transactionService.getAll(),
  };
});

router.post('/api/transactions', async (ctx) => {
  const newTransaction = transactionService.create({
    ...ctx.request.body,
    placeId: Number(ctx.request.body.placeId),
    date: new Date(ctx.request.body.date),
  });
  ctx.body = newTransaction;
});

router.get('/api/transactions/:id', async (ctx) => {
  ctx.body = transactionService.getById(Number(ctx.params.id));
});

router.put('/api/transactions/:id', async (ctx) => {
  ctx.body = transactionService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    placeId: Number(ctx.request.body.placeId),
    date: new Date(ctx.request.body.date),
  });
});

router.delete('/api/transactions/:id', async (ctx) => {
  transactionService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
});

app.use(router.routes())
  .use(router.allowedMethods());

app.listen(9000, () => {
  getLogger().info('🚀 Server listening on http://127.0.0.1:9000');
});