import { defineConfig } from "vite";
import devServer from "@hono/vite-dev-server";

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
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
      plugins: [
        devServer({
          entry: "src/static.tsx",
        }),
      ],
    };
  }
});
