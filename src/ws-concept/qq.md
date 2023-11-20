Idea is to create bi-directional typesafe websocket communication with same type wizzadry as in `hc`.
The client and server are both of type `Hono`, and they both import each other types. I have tested this and there are no circular dependencies.

Here is a simple example of a concept of this

`client.ts`:

```ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { hc } from "hono/client";
import type { WsServer } from "./server";

const server = hc<WsServer>("/whatever");

const client = new Hono().post(
  "/notify",
  zValidator(
    "json",
    z.object({
      message: z.string(),
    })
  ),
  (c) => {
    // pretend like we are connected
    server.sendMessage.$post({
      json: {
        to: "123",
        content: "hello",
      },
    });
    return c.text("OK");
  }
);

export type WsClient = typeof client;
```

`server.ts`:

```ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import type { WsClient } from "./client";
import { hc } from "hono/client";

export type WsServer = typeof server;

const client = hc<WsClient>("/whatever");

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
```
