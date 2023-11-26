import "hono";
import { jsxRenderer } from "hono/jsx-renderer";

declare module "hono" {
  interface ContextRenderer {
    (content: string | Promise<string>, props?: { title?: string }): Response;
  }
}

export const renderer = jsxRenderer(
  ({ children, title }) => {
    return (
      <html>
        <head>
          <link href="/static/style.css" rel="stylesheet" />
          <title>{title}</title>
          {import.meta.env.PROD ? (
            <>
              <script type="module" src="/js/wc.js"></script>
            </>
          ) : (
            <>
              <script type="module" src="/src/wc.ts"></script>
            </>
          )}
        </head>
        <body>{children}</body>
      </html>
    );
  },
  {
    docType: true,
  }
);
