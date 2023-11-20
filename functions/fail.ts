// import { makeSentry } from "../common/sentry";
// simple test for now
import { Sentry } from "@borderless/worker-sentry";
export const onRequest: PagesFunction<{ SENTRY_DSN: string }> = async ({
  request,
  env,
  waitUntil,
}) => {
  console.log("DSN", env.SENTRY_DSN);

  const sentry = new Sentry({ dsn: env.SENTRY_DSN });

  try {
    throw new Error("oups, we intentially failed");
    return new Response("miracles dont happen");
  } catch (error) {
    console.log("capturing expection", error);

    waitUntil(
      sentry.captureException(error, {
        tags: {},
        user: {
          ip: request.headers.get("cf-connecting-ip"),
        },
      })
    );
    return new Response("unknown error, sorry");
  }
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
