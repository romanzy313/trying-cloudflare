// import { makeSentry } from "../common/sentry";
// simple test for now
import type { PluginData } from "@cloudflare/pages-plugin-sentry";
// import { Sentry } from "@borderless/worker-sentry";
export const onRequest: PagesFunction<
  { SENTRY_DSN: string },
  any,
  PluginData
> = async ({ request, env, waitUntil, data }) => {
  console.log("DSN", env.SENTRY_DSN);

  // data.sentry;
  // data.sentry.
  throw new Error("oups, we intentially failed 6666");
  // const sentry = new Sentry({ dsn: env.SENTRY_DSN });
  // throw new Error("super intentional");
  // try {
  //   throw new Error("oups, we intentially failed 6666");
  //   return new Response("miracles dont happen");
  // } catch (error) {
  //   console.log("capturing expection", error);

  //   // waitUntil(
  //   data.sentry.captureException(error, {});
  //   // );
  //   return new Response("unknown error, sorry");
  // }
};

// export default {
//   async fetch(request: Request, env, context) {
//     const sentry = makeSentry(request, env, context);

//     try {
//       throw new Error("oups, we intentially failed");
//       return new Response("Hello, world!");
//     } catch (error) {
//       sentry.captureException(error);
//       return new Response("unknown error, sorry");
//     }
//   },
// };
