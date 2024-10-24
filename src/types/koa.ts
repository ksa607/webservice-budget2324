import type { ParameterizedContext } from 'koa';
import type Application from 'koa';
import type Router from '@koa/router';
import type { SessionInfo } from './auth';

export interface BudgetAppState {
  session: SessionInfo;
}

export interface BudgetAppContext {}

export type KoaContext<
  ResponseBody = unknown,
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> =
  ParameterizedContext<BudgetAppState, BudgetAppContext, ResponseBody>
  & {
    request: {
      body: RequestBody;
      query: Query;
    };
    params: Params;
  };

export interface KoaApplication extends Application<BudgetAppState, BudgetAppContext> {}

export interface KoaRouter extends Router<BudgetAppState, BudgetAppContext> {}
