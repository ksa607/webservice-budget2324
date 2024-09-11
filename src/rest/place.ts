import Router from '@koa/router';
import * as placeService from '../service/place';
import * as transactionService from '../service/transaction';
import type { Context } from 'koa';

const getAllPlaces = async (ctx: Context) => {
  const places = await placeService.getAll();
  ctx.body = {
    items: places,
  };
};

const getPlaceById = async (ctx: Context) => {
  const place = await placeService.getById(Number(ctx.params.id));
  ctx.body = place;
};

const createPlace = async (ctx: Context) => {
  const place = await placeService.create(ctx.request.body!);
  ctx.status = 201;
  ctx.body = place;
};

const updatePlace = async (ctx: Context) => {
  const place = await placeService.updateById(Number(ctx.params.id), ctx.request.body!);
  ctx.body = place;
};

const deletePlace = async (ctx: Context) => {
  await placeService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

const getTransactionsByPlaceId = async (ctx: Context) => {
  const transactions = await transactionService.getTransactionsByPlaceId(Number(ctx.params.id));
  ctx.body = {
    items: transactions,
  };
};

export default (parent: Router) => {
  const router = new Router({
    prefix: '/places',
  });

  router.get('/', getAllPlaces);
  router.get('/:id', getPlaceById);
  router.post('/', createPlace);
  router.put('/:id', updatePlace);
  router.delete('/:id', deletePlace);

  router.get('/:id/transactions', getTransactionsByPlaceId);

  parent.use(router.routes())
    .use(router.allowedMethods());
};
