import sentryPlugin from "@cloudflare/pages-plugin-sentry";
import { dbMiddleware } from "./_middleware/db";
import errorMiddleware from "./_middleware/error";

// async function localErrorHandling(context) {
//   try {
//     return await context.next();
//   } catch (err) {
//     console.error(err);
//     return new Response(`${err.message}\n${err.stack}`, { status: 500 });
//   }
// }

// export const errorMiddleware: PagesFunction<{
//   SENTRY_DSN: string;
//   ENVIRONMENT: string;
// }> = (context) => {
//   console.log("processing middleware", context.env);

//   if (context.env.ENVIRONMENT === "development") {
//     // return custom error handler
//     console.log("using development error handling");

//     return localErrorHandling(context);
//   }

//   return sentryPlugin({
//     dsn: context.env.SENTRY_DSN,
//     environment: context.env.ENVIRONMENT,
//   })(context);
// };

export const onRequest = [errorMiddleware, dbMiddleware];
