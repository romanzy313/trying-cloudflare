import { Hono } from "hono";
import { renderer } from "../common/renderer";
const app = new Hono();

// ssr middleware, wri
app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const end = Date.now();
  c.res.headers.set("X-Response-Time", `${end - start}`);
  //   console.log("in middleware", c.res.headers);
});

app.use("*", renderer);

app.get("/", (c) =>
  c.render(<div>Hello world 222</div>, {
    title: "hello world",
  })
);

app.get("/404", (c) =>
  c.render(<div>Page not found!</div>, {
    title: "hello world",
  })
);
console.log("routes", app.routes);

app.get("/dynamic/:id", (c) => {
  // add parameter for this route
  // need a way to define static params
  return c.render(<div>Id is {c.req.param("id")}</div>);
});

export default app;
