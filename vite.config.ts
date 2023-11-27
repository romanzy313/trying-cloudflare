import { defineConfig } from "vite";
import devServer, { defaultOptions } from "@hono/vite-dev-server";
import pages from "@hono/vite-cloudflare-pages";

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      // publicDir: "public",
      // base: "/",
      build: {
        lib: {
          entry: "./src/wc.ts", // glob the entry
          formats: ["es"],
          fileName: "wc",
          name: "wc",
        },
        rollupOptions: {
          output: {
            dir: "./dist/js",
          },
        },
        emptyOutDir: false,
        copyPublicDir: false,
      },
    };
  } else {
    return {
      // publicDir: "public",
      // base: "/",

      plugins: [
        // pages({
        //   entry: "src/static.tsx",
        // }),
        devServer({
          entry: "src/static.tsx",
          // exclude will be attemted to be served by the miniflare
          exclude: [
            /.*\.ts$/,
            /.*\.tsx$/,
            /^\/@.+$/,
            /^\/favicon\.*$/,
            /^\/static\/.+/,
            /^\/node_modules\/.*/,
          ],
        }),
      ],
    };
  }
});
