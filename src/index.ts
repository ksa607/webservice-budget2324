import Koa from 'koa';
import { getLogger } from './core/logging';
import installRest from './rest';
import { initializeData } from './data';
import installMiddlewares from './core/installMiddlewares';
import type { BudgetAppContext, BudgetAppState } from './types/koa';

async function main(): Promise<void> {
  const app = new Koa<BudgetAppState, BudgetAppContext>();

  installMiddlewares(app);
  await initializeData();
  installRest(app);

  app.listen(9000, () => {
    getLogger().info('🚀 Server listening on http://127.0.0.1:9000');
  });
}
main();