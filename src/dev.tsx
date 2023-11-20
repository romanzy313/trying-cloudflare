import { serve } from "@hono/node-server";
import app from "./static";

serve(
  {
    fetch: app.fetch,
    port: 4500,
  },
  (info) => {
    console.log("serving app", info);
  }
);
