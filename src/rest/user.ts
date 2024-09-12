import Router from '@koa/router';
import * as userService from '../service/user';
import type { Context } from 'koa';

const getAllUsers = async (ctx: Context) => {
  const users = await userService.getAll();
  ctx.body = { items: users };
};

const createUser = async (ctx: Context) => {
  const user = await userService.create(ctx.request.body);
  ctx.status = 200;
  ctx.body = user;
};

const getUserById = async (ctx: Context) => {
  const user = await userService.getById(Number(ctx.params.id));
  ctx.status = 200;
  ctx.body = user;
};

const updateUserById = async (ctx: Context) => {
  const user = await userService.updateById(Number(ctx.params.id), ctx.request.body);
  ctx.status = 200;
  ctx.body = user;
};

const deleteUserById = async (ctx: Context) => {
  await userService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

export default (parent: Router) => {
  const router = new Router({ prefix: '/users' });

  router.get('/', getAllUsers);
  router.get('/:id', getUserById);
  router.post('/', createUser);
  router.put('/:id', updateUserById);
  router.delete('/:id', deleteUserById);

  parent
    .use(router.routes())
    .use(router.allowedMethods());
};
