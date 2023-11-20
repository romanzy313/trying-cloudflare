import type { Options } from "toucan-js/dist/types";
import { Toucan } from "toucan-js";

export type PluginArgs = Omit<Options, "context">;

export type PluginData = { sentry: Toucan };

type SentryPagesPluginFunction<
  Env = {
    SENTRY_DSN: string;
    ENVIRONMENT: string;
  },
  Params extends string = any,
  Data extends Record<string, unknown> = Record<string, unknown>
> = PagesPluginFunction<Env, Params, Data & PluginData, PluginArgs>;

const onRequest: SentryPagesPluginFunction = async (context) => {
  if (context.env.ENVIRONMENT === "development") {
    context.data.sentry = {
      captureException: (exception: unknown, hint?: any) => {
        console.error("Captured exception", exception);
      },
      captureMessage: (
        message: string,
        level?: "fatal" | "error" | "warning" | "log" | "info" | "debug",
        hint?: any
      ) => {
        console.log(`[${level || "log"}]`, message);
      },
    } as any;

    try {
      return await context.next();
    } catch (err: any) {
      console.error(err);
      return new Response(`${err.message}\n${err.stack}`, { status: 500 });
    }
  }

  context.data.sentry = new Toucan({
    context,
    ...context.pluginArgs,
  });

  try {
    return await context.next();
  } catch (thrown) {
    const event_id = crypto.randomUUID();
    context.data.sentry.captureException(thrown, {
      event_id,
    });
    // throw thrown;
    return new Response(`unknown error, event_id ${event_id}`, {
      status: 500,
    });
  }
};

export default onRequest;
