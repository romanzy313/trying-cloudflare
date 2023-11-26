// this is not used as we are vite integrated... how nice

import { serve } from "@hono/node-server";
import app from "./static";

const serverRes = serve(
  {
    fetch: app.fetch,
    port: 4500,
  },
  (info) => {
    console.log("serving app", info);
  }
);

// build

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    serverRes.close();
  });
}
