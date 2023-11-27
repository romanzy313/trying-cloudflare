import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { UploadForm } from "./templates";
// import { PROFILE_IMAGE_OPTS, processImage } from "./imageProcessing";
import { getFileUrl } from "./utils";
import { jsxRenderer } from "hono/jsx-renderer";
// import { Buffer } from "node:buffer";
import { processImg3 } from "./process3";
// import { processImage2 } from "./imageProcessing2";
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
          <link rel="stylesheet" href="/static/vendor/pico.min.css" />
          <script src="/static/vendor/htmx.min.js"></script>
        </head>
        <body>{children}</body>
      </html>
    );
  },
  {
    docType: true,
  }
);

type Bindings = {
  R2: R2Bucket;
};

const app = new Hono<{
  Bindings: Bindings;
}>().basePath("/upload");

app.use(renderer);

app
  .get("/", (c) => {
    return c.render(<UploadForm id={crypto.randomUUID()} />, {
      title: "upload file",
    });
  })
  .get("/list", async (c) => {
    const res = await c.env.R2.list();
    console.log("list res", res);

    return c.render(
      <ul>
        {res.objects.map((v, i) => (
          <li>
            {i}: {v.key}
          </li>
        ))}
      </ul>
    );
  })
  .post("/", async (c) => {
    const body = await c.req.parseBody({});

    const file = body.file as File;
    const id = body.id as string;

    console.log(
      "file is",
      file,
      "typeof",
      typeof file,
      "is file",
      file instanceof File
    );

    if (!(file instanceof File) || typeof id !== "string" || !id) {
      console.log("inputs are", file, id);

      return c.html(
        <UploadForm
          id={(id as string) || crypto.randomUUID()}
          error="bad inputs"
        ></UploadForm>
      );
    }

    const processedName = `${id}.webp`;
    // otherwise process it...

    // const processed = await processImage(file, id, PROFILE_IMAGE_OPTS);

    // const ogBuffer = Buffer.from(await file.arrayBuffer());

    // const vec = new Uint8Array(await file.arrayBuffer());
    const arBuff = await file.arrayBuffer();
    let processed: ArrayBuffer;
    try {
      processed = await processImg3(arBuff, file.type);
    } catch (error: any) {
      return c.html(
        <UploadForm
          id={id}
          error={`Failed to process ${error.message}`}
        ></UploadForm>
      );
    }
    // const processed = await processImage2(ogBuffer);
    // if (!processed.jpeg)
    //   return c.render(
    //     <UploadForm id={id} error="failed to process"></UploadForm>
    //   );

    try {
      const uploadRes = await c.env.R2.put(processedName, processed);
      console.log("upload success, res", uploadRes);
    } catch (error: any) {
      return c.html(
        <UploadForm
          id={id}
          error={`Failed to upload ${error.message}`}
        ></UploadForm>
      );
    }
    // now upload to R2

    const uploadedUrl = getFileUrl(processedName);

    // mark as uploaded, update the src?

    return c.html(
      <UploadForm
        id={id}
        error="upload success!"
        imgUrl={uploadedUrl}
      ></UploadForm>
    );
  });

export const onRequest = handle(app);
