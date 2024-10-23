import Router from '@koa/router';
import Joi from 'joi';
import * as userService from '../service/user';
import type { BudgetAppContext, BudgetAppState} from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  RegisterUserRequest,
  RegisterUserResponse,
  GetAllUsersResponse,
  GetUserByIdResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from '../types/user';
import type { IdParams } from '../types/common';
import validate from '../core/validation';

const getAllUsers = async (ctx: KoaContext<GetAllUsersResponse>) => {
  const users = await userService.getAll();
  ctx.body = { items: users };
};
getAllUsers.validationScheme = null;

const registerUser = async (ctx: KoaContext<RegisterUserResponse, void, RegisterUserRequest>) => {
  const user = await userService.register(ctx.request.body);
  ctx.status = 200;
  ctx.body = user;
};
registerUser.validationScheme = {
  body: {
    name: Joi.string().max(255),
    email: Joi.string().email(),
  },
};

const getUserById = async (ctx: KoaContext<GetUserByIdResponse, IdParams>) => {
  const user = await userService.getById(ctx.params.id);
  ctx.status = 200;
  ctx.body = user;
};
getUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const updateUserById = async (ctx: KoaContext<UpdateUserResponse, IdParams, UpdateUserRequest>) => {
  const user = await userService.updateById(ctx.params.id, ctx.request.body);
  ctx.status = 200;
  ctx.body = user;
};
updateUserById.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    name: Joi.string().max(255),
    email: Joi.string().email(),
  },
};

const deleteUserById = async (ctx: KoaContext<void, IdParams>) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<BudgetAppState, BudgetAppContext>({ prefix: '/users' });

  router.get('/', validate(getAllUsers.validationScheme), getAllUsers);
  router.get('/:id', validate(getUserById.validationScheme), getUserById);
  router.post('/', validate(registerUser.validationScheme), registerUser);
  router.put('/:id', validate(updateUserById.validationScheme), updateUserById);
  router.delete('/:id', validate(deleteUserById.validationScheme), deleteUserById);

  parent
    .use(router.routes())
    .use(router.allowedMethods());
};
