// javascript client to build...
// this needs vite?
import { AppType } from "./static";
import { WsType } from "../functions/ws/[[any]]";
import { hc } from "hono/client";

// const client = hc<Type>("/ws");

// const res = await client.dynamic[":id"].$get({
//   param: {
//     id: "dfsdf",
//   },
// });

const client = hc<WsType>("/ws");
const res = await client.ws.subscribe.$post({
  json: {
    name: "sdfsdf",
  },
});
