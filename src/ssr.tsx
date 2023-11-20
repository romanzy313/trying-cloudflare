import { Hono } from "hono";
import { renderer } from "../common/renderer";
import fs from "fs/promises";
import path from "path";

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
  c.render(<div>Hello world</div>, {
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

class SSRRunner {
  private routes: string[] = [];
  constructor(private app: Hono, private dest: string) {}

  addRoute(url: string) {
    this.routes.push(url);
  }
  addRoutes(urls: string[]) {
    this.routes.push(...urls);
  }

  useAllGets(ignoreDynamic = true) {
    let autoRoutes = this.app.routes
      .filter((v) => v.method == "GET")
      .map((v) => v.path);

    if (ignoreDynamic) autoRoutes = autoRoutes.filter((v) => !v.includes(":"));

    this.routes.push(...autoRoutes);
  }

  async run() {
    const renderProm = this.routes.map((route) => {
      const url = `http://example.com${route}`;
      console.log("rendering", route);

      return (app.fetch(new Request(url)) as any).then((v) => {
        return v.text();
      }) as Promise<string>;
    });

    const renderRes = await Promise.all(renderProm);
    console.log("rendered", renderRes.length, "routes");

    await fs.mkdir(this.dest, {
      recursive: true,
    });
    const writeProm = renderRes.map((v, i) => {
      const route = this.routes[i] == "/" ? "/index" : `${this.routes[i]}`;

      const destination = path.join(this.dest, route);
      const file = destination + ".html";

      console.log("writing", route);
      // make dir if needed
      const parts = route.substring(1).split("/");
      if (parts.length == 1) {
        return fs.writeFile(file, v);
      }

      // sometimes apis are painful
      parts.pop();

      return fs
        .mkdir(path.join(this.dest, parts.join("/")), {
          recursive: true,
        })
        .then(() => {
          return fs.writeFile(file, v);
        });
      //   return new Promise((resolve) => {
      //     fs.writeFile(destination, v);
      //   })
    });

    const writeRes = await Promise.all(writeProm);
    console.log("saved", writeRes.length, "routes");
  }
}

const ssr = new SSRRunner(app, "./pages-gen");
// ssr.addRoute("/");

ssr.useAllGets();
ssr.addRoutes(["/dynamic/344", "/dynamic/233"]);

await ssr.run();

// async function doSsr(url: string) {
//   const result = await app.fetch(new Request("http://example.com/"));

//   console.log(
//     "got result",
//     await result.text(),
//     "time",
//     result.headers.get("x-response-time")
//   );
// }

// // kind of like ssr...
// const result = await app.fetch(new Request("http://example.com/"));

// console.log(
//   "got result",
//   await result.text(),
//   "time",
//   result.headers.get("x-response-time")
// );
