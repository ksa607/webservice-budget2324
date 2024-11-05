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
import { requireAuthentication } from '../core/auth';

/**
 * @swagger
 * tags:
 *   name: Places
 *   description: Represents an income source or a expense item
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Place:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - id
 *             - name
 *             - rating
 *           properties:
 *             name:
 *               type: "string"
 *             rating:
 *               type: "integer"
 *               minimum: 1
 *               maximum: 5
 *           example:
 *             id: 123
 *             name: Loon
 *             rating: 4
 *     PlacesList:
 *       required:
 *         - items
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Place"
 *     PlaceDetail:
 *       allOf:
 *         - $ref: "#/components/schemas/Place"
 *         - type: object
 *           required:
 *             - transactions
 *           properties:
 *             transactions:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Transaction"
 *           example:
 *             id: 123
 *             name: Loon
 *             rating: 4
 *             transactions:
 *               - id: 123
 *                 amount: 3000
 *                 date: "2021-05-28T14:27:32.534Z"
 *                 place:
 *                   id: 123
 *                   name: Loon
 *                   rating: 4
 *                 user:
 *                   id: 123
 *                   name: "Thomas Aelbecht"
 *                   email: "thomas.aelbrecht@hogent.be"
 *
 *   requestBodies:
 *     Place:
 *       description: The place info to save
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *             required:
 *               - name
 */

/**
 * @swagger
 * /api/places:
 *   get:
 *     summary: Get all places
 *     tags:
 *       - Places
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of places
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PlacesList"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 */
const getAllPlaces = async (ctx: KoaContext<GetAllPlacesResponse>) => {
  const places = await placeService.getAll();
  ctx.body = {
    items: places,
  };
};
getAllPlaces.validationScheme = null;

/**
 * @swagger
 * /api/places/{id}:
 *   get:
 *     summary: Get a single place
 *     tags:
 *       - Places
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The requested place
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PlaceDetail"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
const getPlaceById = async (ctx: KoaContext<GetPlaceByIdResponse, IdParams>) => {
  const place = await placeService.getById(ctx.params.id);
  ctx.body = place;
};
getPlaceById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/places:
 *   post:
 *     summary: Create a new place
 *     tags:
 *       - Places
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: "#/components/requestBodies/Place"
 *     responses:
 *       200:
 *         description: The created place
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Place"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 */
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

/**
 * @swagger
 * /api/places/{id}:
 *   put:
 *     summary: Update an existing place
 *     tags:
 *       - Places
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     requestBody:
 *       $ref: "#/components/requestBodies/Place"
 *     responses:
 *       200:
 *         description: The updated place
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Place"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
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

/**
 * @swagger
 * /api/places/{id}:
 *   delete:
 *     summary: Delete a place
 *     tags:
 *       - Places
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       204:
 *         description: No response, the delete was successful
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
const deletePlace = async (ctx: KoaContext<void, IdParams>) => {
  await placeService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deletePlace.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/places/{id}/transactions:
 *   get:
 *     summary: Get all transactions for a place
 *     tags:
 *       - Places
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: List of transactions for that place
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TransactionsList"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 */
const getTransactionsByPlaceId = async (ctx: KoaContext<GetAllTransactionsReponse, IdParams>) => {
  const transactions = await transactionService.getTransactionsByPlaceId(ctx.params.id, ctx.state.session.userId);
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

  router.use(requireAuthentication);

  router.get('/', validate(getAllPlaces.validationScheme), getAllPlaces);
  router.get('/:id', validate(getPlaceById.validationScheme), getPlaceById);
  router.post('/', validate(createPlace.validationScheme), createPlace);
  router.put('/:id', validate(updatePlace.validationScheme), updatePlace);
  router.delete('/:id', validate(deletePlace.validationScheme), deletePlace);

  router.get('/:id/transactions', validate(getTransactionsByPlaceId.validationScheme), getTransactionsByPlaceId);

  parent.use(router.routes())
    .use(router.allowedMethods());
};
