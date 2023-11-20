import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import type { DB } from "kysely-codegen";

export type DbPluginData = {
  db: Kysely<DB>;
};

type DbPluginFunction<
  Env = { DB: D1Database },
  Params extends string = any,
  Data extends Record<string, unknown> = Record<string, unknown>
> = PagesPluginFunction<Env, Params, Data & DbPluginData, {}>;

export const dbMiddleware: DbPluginFunction = async (context) => {
  context.data.db = new Kysely<DB>({
    dialect: new D1Dialect({ database: context.env.DB }),
  });
  return await context.next();
};
