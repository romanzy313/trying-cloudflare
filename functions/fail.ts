import { makeSentry } from "../common/sentry";
// export function onRequest() {
//   const sentry = makeSentry();
//   try {
//     throw new Error("oups, we intentially failed");
//     return "";
//   } catch (error) {
//     return new Response("unknown error, sorry");
//   }
// }

export default {
  async fetch(request: Request, env, context) {
    const sentry = makeSentry(request, env, context);

    try {
      throw new Error("oups, we intentially failed");
      return new Response("Hello, world!");
    } catch (error) {
      sentry.captureException(error);
      return new Response("unknown error, sorry");
    }
  },
};
