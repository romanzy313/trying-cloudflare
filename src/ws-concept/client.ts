import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { hc } from "hono/client";
import type { WsServer } from "./server";

type Wrap<T extends Hono<any, any, any>> = ReturnType<typeof hc<T>>;

const hcClientWs = <Server extends Hono<any, any, any>, Client = unknown>(
  url: string,
  other: {
    onConnected: (server: Wrap<Server>) => void;
    client: (server: Wrap<Server>) => Client;
  }
): {
  server: Wrap<Server>;
  __client: Client;
} => {
  // implement
  const ws = new WebSocket(url);

  return null as any;
};

const client = hcClientWs<WsServer>("ws://example.com", {
  onConnected: (server) => {
    server.sendMessage.$post({
      json: {
        to: "1234",
        content: "hello",
      },
    });
  },
  client: (server) =>
    new Hono().post(
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
    ),
});

export type WsClient = typeof client.__client;
