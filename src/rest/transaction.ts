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

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Represents a deposit of withdrawel of a user's budget
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - amount
 *             - date
 *             - user
 *             - place
 *           properties:
 *             name:
 *               type: "string"
 *             date:
 *               type: "string"
 *               format: date-time
 *             place:
 *               $ref: "#/components/schemas/Place"
 *             user:
 *               $ref: "#/components/schemas/User"
 *           example:
 *             id: 123
 *             amount: 3000
 *             date: "2021-05-28T14:27:32.534Z"
 *             place:
 *               id: 123
 *               name: Loon
 *               rating: 4
 *             user:
 *               id: 123
 *               name: "Thomas Aelbecht"
 *               email: "thomas.aelbrecht@hogent.be"
 *     TransactionsList:
 *       required:
 *         - items
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Transaction"
 *
 *   requestBodies:
 *     Transaction:
 *       description: The transaction info to save.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: integer
 *                 example: 101
 *               date:
 *                 type: string
 *                 format: "date-time"
 *               placeId:
 *                 type: integer
 *                 format: int32
 */

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags:
 *      - Transactions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TransactionsList"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 */
const getAllTransactions = async (ctx: KoaContext<GetAllTransactionsReponse>) => {
  ctx.body = {
    items: await transactionService.getAll(
      ctx.state.session.userId,
      ctx.state.session.roles,
    ),
  };
};
getAllTransactions.validationScheme = null;

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     description: Creates a new transaction for the signed in user.
 *     tags:
 *      - Transactions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: "#/components/requestBodies/Transaction"
 *     responses:
 *       200:
 *         description: The created transaction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Transaction"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
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

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get a single transaction
 *     tags:
 *      - Transactions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The requested transaction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Transaction"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
const getTransactionById = async (ctx: KoaContext<GetTransactionByIdResponse, IdParams>) => {
  ctx.body = await transactionService.getById(
    ctx.params.id, 
    ctx.state.session.userId,
    ctx.state.session.roles,
  );
};
getTransactionById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update an existing transaction
 *     tags:
 *      - Transactions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     requestBody:
 *       $ref: "#/components/requestBodies/Transaction"
 *     responses:
 *       200:
 *         description: The updated transaction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Transaction"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
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

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     tags:
 *      - Transactions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       204:
 *         description: No response, the delete was successful.
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
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
