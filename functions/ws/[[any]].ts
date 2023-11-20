// websocket.ts
import type { WebSocket as CFWebSocket } from "@cloudflare/workers-types";
import { Hono } from "hono";
import { html } from "hono/html";

const app = new Hono().basePath("/ws");

app.get("/", (c) => {
  return c.html(
    html`<!DOCTYPE html>
      <html>
        <body>
          <script>
            const hostname = window.location.host;
            const protocol =
              document.location.protocol === "http:" ? "ws://" : "wss://";
            const url = protocol + hostname + "/ws/websocket";
            console.log("connecting to", url);
            const ws = new WebSocket(url);

            ws.addEventListener("message", ({ data }) => {
              console.log(data);
            });

            setInterval(() => {
              const msg = "Hello " + Math.random();
              console.log("Ping: " + msg);
              ws.send(msg);
            }, 2000);
          </script>
          <h1>WebSocket</h1>
        </body>
      </html>`
  );
});

app.get("/websocket", (c) => {
  console.log("in websocket!!");

  const upgradeHeader = c.req.header("Upgrade");
  if (upgradeHeader !== "websocket") {
    return c.text("Expected websocket", 400);
  }

  const webSocketPair = new WebSocketPair();
  const client = webSocketPair[0];
  const server = webSocketPair[1] as unknown as CFWebSocket;
  server.accept();
  server.send("Hello");

  server.addEventListener("message", (v) => {
    console.log("got message", v.data);

    server.send(`Pong: ${v.data}`);
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
});

app.get("/ping", (c) => c.text("pong"));

export const onRequest: PagesFunction<{}> = async ({
  request,
  env,
  waitUntil,
  passThroughOnException,
}) => {
  return app.fetch(request, env, {
    waitUntil,
    passThroughOnException,
  });
};
