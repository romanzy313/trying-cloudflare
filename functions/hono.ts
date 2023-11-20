// import type { FC } from "hono/jsx";
import { Hono } from "hono";
// import { jsxRenderer } from "hono/jsx-renderer";
// import { upgrade } from "./cheeky_render";
// declare module "hono" {
//   interface ContextRenderer {
//     (content: string | Promise<string>, props?: { title?: string }): Response;
//   }
// }

// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       "my-custom-element": Hono.HTMLAttributes & {
//         "x-event"?: "click" | "scroll";
//       };
//     }
//   }
// }

// export const renderer = jsxRenderer(
//   ({ children, title }) => {
//     return (
//       <html>
//         <head>
//           <link href="/static/style.css" rel="stylesheet" />
//           <title>{title}</title>
//         </head>
//         <body>{children}</body>
//       </html>
//     );
//   },
//   {
//     docType: true,
//   }
// );

console.log("we are here");

const app = new Hono();

// upgrade(app);

app.get("/", (c) => c.html("hii"));
// app.fire();
// tsx dont work?
export const onRequest: PagesFunction<{}> = async ({
  data,
  request,
  params,
  env,
  waitUntil,
  passThroughOnException,
}) => {
  // return new Response("hello world");
  console.log("in request");

  return app.fetch(request, env, {
    waitUntil,
    passThroughOnException,
  });
  // return app.request(request);
  // return
};
