import Router from '@koa/router';
import Joi from 'joi';
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
import validate from '../core/validation';

const getAllPlaces = async (ctx: KoaContext<GetAllPlacesResponse>) => {
  const places = await placeService.getAll();
  ctx.body = {
    items: places,
  };
};
getAllPlaces.validationScheme = null;

const getPlaceById = async (ctx: KoaContext<GetPlaceByIdResponse, IdParams>) => {
  const place = await placeService.getById(ctx.params.id);
  ctx.body = place;
};
getPlaceById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const createPlace = async (ctx: KoaContext<CreatePlaceResponse, void, CreatePlaceRequest>) => {
  const place = await placeService.create(ctx.request.body);
  ctx.status = 201;
  ctx.body = place;
};
createPlace.validationScheme = {
  body: {
    name: Joi.string().max(255),
    rating: Joi.number().integer().min(1).max(5).optional(),
  },
};

const updatePlace = async (ctx: KoaContext<UpdatePlaceResponse, IdParams, UpdatePlaceRequest>) => {
  const place = await placeService.updateById(ctx.params.id, ctx.request.body);
  ctx.body = place;
};
updatePlace.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    name: Joi.string().max(255),
    rating: Joi.number().integer().min(1).max(5),
  },
};

const deletePlace = async (ctx: KoaContext<void, IdParams>) => {
  await placeService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deletePlace.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const getTransactionsByPlaceId = async (ctx: KoaContext<GetAllTransactionsReponse, IdParams>) => {
  const transactions = await transactionService.getTransactionsByPlaceId(ctx.params.id);
  ctx.body = {
    items: transactions,
  };
};
getTransactionsByPlaceId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<BudgetAppState, BudgetAppContext>({
    prefix: '/places',
  });

  router.get('/', validate(getAllPlaces.validationScheme), getAllPlaces);
  router.get('/:id', validate(getPlaceById.validationScheme), getPlaceById);
  router.post('/', validate(createPlace.validationScheme), createPlace);
  router.put('/:id', validate(updatePlace.validationScheme), updatePlace);
  router.delete('/:id', validate(deletePlace.validationScheme), deletePlace);

  router.get('/:id/transactions', validate(getTransactionsByPlaceId.validationScheme), getTransactionsByPlaceId);

  parent.use(router.routes())
    .use(router.allowedMethods());
};
