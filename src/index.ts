import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from '@koa/router';
import { getLogger } from './core/logging';

const app = new Koa();

app.use(bodyParser());

const router = new Router();

router.get('/api/transactions', async (ctx) => {
  ctx.body = '[{"user": "Benjamin", "amount": 100, "place": "Irish Pub", "date": "2021-08-15" }]';
});

app.use(router.routes())
  .use(router.allowedMethods());

app.listen(9000, () => {
  getLogger().info('🚀 Server listening on http://127.0.0.1:9000');
});