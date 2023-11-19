import { Toucan } from "toucan-js";

export function makeSentry(request: any, env: any, context: any) {
  const sentry = new Toucan({
    dsn: env.SENTRY_DSN,
    context,
    request,

    // integrations: [new RewriteFrames({ root: "/" })],
  });

  return sentry;
}
