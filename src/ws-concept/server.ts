// import { Hono } from "hono";
// import { zValidator } from "@hono/zod-validator";
// import z from "zod";
// import type { WsClient } from "./client";
// import { hc } from "hono/client";

// export type WsServer = typeof server;

// const client = hc<WsClient>("/whatever");

// const server = new Hono().post(
//   "/sendMessage",
//   zValidator(
//     "json",
//     z.object({
//       to: z.string(),
//       content: z.string(),
//     })
//   ),
//   (c) => {
//     // pretend like this calling an rpc over websockets
//     client.notify.$post({
//       json: {
//         message: "notification on client",
//       },
//     });

//     return c.jsonT({
//       success: true,
//     });
//   }
// );

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { hc } from "hono/client";
import type { WsServer } from "./server";
import { WsClient } from "./client";

type Wrap<T extends Hono<any, any, any>> = ReturnType<typeof hc<T>>;

const hcServerWs = <
  Client extends Hono<any, any, any>,
  Server extends Hono<any, any, any> = Hono<any, any, any>
>(
  url: string,
  other: {
    onConnected: (client: Wrap<Client>) => void;
    // allow or deny upgrade
    accept?: (request: Request) => boolean;
    server: (client: Wrap<Client>) => Client;
  }
): {
  client: Wrap<Client>;
  __server: Client;
} => {
  return null as any;
};

const server = new Hono().post(
  "/sendMessage",
  zValidator(
    "json",
    z.object({
      to: z.string(),
      content: z.string(),
    })
  ),
  (c) => {
    const client = hc<WsClient>("/sfwef");
    // pretend like this calling an rpc over websockets
    client.notify.$post({
      json: {
        message: "notification on client",
      },
    });

    return c.jsonT({
      success: true,
    });
  }
);
export type WsServer = typeof server;

const client = hcServerWs<WsServer>("ws://example.com", {
  onConnected: (server) => {
    server.sendMessage.$post({
      json: {
        to: "1234",
        content: "hello",
      },
    });
  },
  server: (client) => server,
});
