import fs from "fs/promises";
import { ImagePool } from "@squoosh/lib";
// import { cpus } from "os";
const imagePool = new ImagePool(1);

export async function processImage2(originalImage: Buffer) {
  const image = imagePool.ingestImage(originalImage);

  await image.preprocess({
    resize: {
      height: 200,
      width: 200,
    },
  });

  await image.encode({
    webp: { quality: 90 },
    jpeg: {
      quality: 90,
    },
  });

  const [webp, jpeg] = await Promise.all([
    image.encodedWith.webp,
    image.encodedWith.mozjpeg,
  ]);
  return {
    webp,
    jpeg,
  };
}
