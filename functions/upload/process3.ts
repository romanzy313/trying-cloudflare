// sources: https://github.com/jamsinclair/jSquash/tree/main/packages/resize
// https://github.com/jamsinclair/jSquash/tree/main/examples/cloudflare-worker-esm-format

import decodeJpeg, { init as initJpegWasm } from "@jsquash/jpeg/decode";
//@ts-expect-error
import JPEG_DEC_WASM from "../../node_modules/@jsquash/jpeg/codec/dec/mozjpeg_dec.wasm";

import decodePng, { init as initPngWasm } from "@jsquash/png/decode";
import PNG_DEC_WASM from "../../node_modules/@jsquash/png/codec/squoosh_png_bg.wasm";

import encodeWebp, { init as initWebpWasm } from "@jsquash/webp/encode";
// @ts-expect-error
import WEBP_ENC_WASM from "../../node_modules/@jsquash/webp/codec/enc/webp_enc_simd.wasm";

import resize, { initResize } from "@jsquash/resize";
import RESIZE_WASM from "../../node_modules/@jsquash/resize/lib/resize/squoosh_resize_bg.wasm";

// @Note, We need to manually import the WASM binaries below so that we can use them in the worker
// CF Workers do not support dynamic imports

const decodeImage = async (buffer: ArrayBuffer, format: string) => {
  if (format === "image/jpeg" || format === "image/jpg") {
    // @Note, we need to manually initialise the wasm module here from wasm import at top of file
    await initJpegWasm(JPEG_DEC_WASM);
    return decodeJpeg(buffer);
  } else if (format === "image/png") {
    // @Note, we need to manually initialise the wasm module here from wasm import at top of file
    await initPngWasm(PNG_DEC_WASM);
    return decodePng(buffer);
  }

  throw new Error(`Unsupported format: ${format}`);
};

// @Note, We need to manually import the WASM binaries below so that we can use them in the worker
// CF Workers do not support dynamic imports
// import JPEG_DEC_WASM from "@jsquash/jpeg/codec/dec/mozjpeg_dec.wasm";
// import PNG_DEC_WASM from "@jsquash/png/codec/squoosh_png_bg.wasm";
// import WEBP_ENC_WASM from "@jsquash/webp/codec/enc/webp_enc_simd.wasm";
// import reduce from "image-blob-reduce";

export const processImg3 = async (buffer: ArrayBuffer, format: string) => {
  // JPEG_DEC_WASM is the name of the imported file
  await initWebpWasm(WEBP_ENC_WASM); // JPEG_DEC_WASM is the name of the imported file
  await initResize(RESIZE_WASM);

  const imgData = await decodeImage(buffer, format);
  // const image = await fetch('./image.jpeg').then(res => res.arrayBuffer()).then(decode);

  // const img = decodeImage(buffer, format)

  // img.
  const resized = await resize(imgData, {
    height: 200,
    width: 200,
    fitMethod: "stretch",
  });

  const result = await encodeWebp(resized, {
    quality: 60,
  });

  return result;
};
