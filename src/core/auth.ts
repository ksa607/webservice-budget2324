import type { Next } from 'koa';
import type { KoaContext } from '../types/koa';
import * as userService from '../service/user';

export const requireAuthentication = async (ctx: KoaContext, next: Next) => {
  const { authorization } = ctx.headers;

  ctx.state.session = await userService.checkAndParseSession(authorization);

  return next();
};

export const makeRequireRole = (role: string) => async (ctx: KoaContext, next: Next) => {
  const { roles = [] } = ctx.state.session;

  userService.checkRole(role, roles);

  return next();
};
