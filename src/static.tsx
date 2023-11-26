import { Hono } from "hono";
import { renderer } from "../common/renderer";
const app = new Hono()
  .use("*", async (c, next) => {
    const start = Date.now();
    await next();
    const end = Date.now();
    c.res.headers.set("X-Response-Time", `${end - start}`);
    //   console.log("in middleware", c.res.headers);
  })
  .use("*", renderer)
  .get("/", (c) =>
    c.render(
      <div>
        <div>
          <b>Hello world 13123</b>
        </div>
        <hello-world></hello-world>
      </div>,
      {
        title: "hello world",
      }
    )
  )
  .get("/404", (c) =>
    c.render(<div>Page not found!</div>, {
      title: "hello world",
    })
  )
  .get("/dynamic/:id", (c) => {
    // add parameter for this route
    // need a way to define static params
    return c.render(<div>Id is {c.req.param("id")}</div>);
  });

export type AppType = typeof app;

// app.render()

export default app;
