import Router from '@koa/router';
import * as placeService from '../service/place';
import * as transactionService from '../service/transaction';
import type { BudgetAppContext, BudgetAppState} from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreatePlaceRequest,
  CreatePlaceResponse,
  GetAllPlacesResponse,
  GetPlaceByIdResponse,
  UpdatePlaceRequest,
  UpdatePlaceResponse,
} from '../types/place';
import type { IdParams } from '../types/common';
import type { GetAllTransactionsReponse } from '../types/transaction';

const getAllPlaces = async (ctx: KoaContext<GetAllPlacesResponse>) => {
  const places = await placeService.getAll();
  ctx.body = {
    items: places,
  };
};

const getPlaceById = async (ctx: KoaContext<GetPlaceByIdResponse, IdParams>) => {
  const place = await placeService.getById(Number(ctx.params.id));
  ctx.body = place;
};

const createPlace = async (ctx: KoaContext<CreatePlaceResponse, void, CreatePlaceRequest>) => {
  const place = await placeService.create(ctx.request.body!);
  ctx.status = 201;
  ctx.body = place;
};

const updatePlace = async (ctx: KoaContext<UpdatePlaceResponse, IdParams, UpdatePlaceRequest>) => {
  const place = await placeService.updateById(Number(ctx.params.id), ctx.request.body!);
  ctx.body = place;
};

const deletePlace = async (ctx: KoaContext<void, IdParams>) => {
  await placeService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

const getTransactionsByPlaceId = async (ctx: KoaContext<GetAllTransactionsReponse, IdParams>) => {
  const transactions = await transactionService.getTransactionsByPlaceId(Number(ctx.params.id));
  ctx.body = {
    items: transactions,
  };
};

export default (parent: KoaRouter) => {
  const router = new Router<BudgetAppState, BudgetAppContext>({
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
