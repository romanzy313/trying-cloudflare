import { Hono } from "hono";
import fs from "fs/promises";
import path from "path";
import app from "./static";

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
    console.log("all routes 2", this.routes);

    const renderProm = this.routes.map((route) => {
      const url = `http://example.com${route}`;
      console.log("rendering", route);

      return (app.fetch(new Request(url)) as any).then((v: any) => {
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

      return new Promise<void>((resolve) => {
        fs.mkdir(path.join(this.dest, parts.join("/")), {
          recursive: true,
        }).then(() => {
          fs.writeFile(file, v).then(() => {
            resolve();
          });
        });
      });
    });
    const writeRes = await Promise.all(writeProm);
    console.log("saved", writeRes.length, "routes");

    console.log("SSR COMPLETE");
  }
}

const ssr = new SSRRunner(app, "./dist");
// ssr.addRoute("/");

ssr.useAllGets();
ssr.addRoutes(["/dynamic/344", "/dynamic/233"]);

console.log("running render", Date.now());

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
