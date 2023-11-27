// sources: https://github.com/jamsinclair/jSquash/tree/main/packages/resize
// https://github.com/jamsinclair/jSquash/tree/main/examples/cloudflare-worker-esm-format

// import decodeJpeg, { init as initJpegWasm } from "@jsquash/jpeg/decode";
import decodePng, { init as initPngWasm } from "@jsquash/png/decode";
// import encodeWebp, { init as initWebpWasm } from "@jsquash/webp/encode";

// @Note, We need to manually import the WASM binaries below so that we can use them in the worker
// CF Workers do not support dynamic imports
// import JPEG_DEC_WASM from "@jsquash/jpeg/codec/dec/mozjpeg_dec.wasm";
// import PNG_DEC_WASM from "@jsquash/png/codec/squoosh_png_bg.wasm";
// import WEBP_ENC_WASM from "@jsquash/webp/codec/enc/webp_enc_simd.wasm";
// import reduce from "image-blob-reduce";

import decode, { init as initJpegDecode } from "@jsquash/jpeg/decode";
import resize, { initResize } from "@jsquash/resize";
// Import the correct WASM module from the node_modules folder
// @ts-expect-error
import JPEG_DEC_WASM from "../../node_modules/@jsquash/jpeg/codec/dec/mozjpeg_dec.wasm";
import RESIZE_WASM from "../../node_modules/@jsquash/resize/lib/resize/squoosh_resize_bg.wasm";
import encodeWebP, { init as initEncWebpWasm } from "@jsquash/webp/encode";

// @ts-expect-error
import ENCODE_WEBP from "../../node_modules/@jsquash/webp/codec/enc/webp_enc.wasm";
// import JPEG_DEC_WASM from '../../node_modules/@jsquash/jpeg/decode/dist/decode.wasm';

// export const decodeImage = async (buffer: ArrayBuffer, format: string) => {
//   //   if (format === "jpeg" || format === "jpg") {
//   //     // @Note, we need to manually initialise the wasm module here from wasm import at top of file
//   //     await initJpegWasm(JPEG_DEC_WASM);
//   //     return decodeJpeg(buffer);
//   //   } else

//   if (format === "png") {
//     // @Note, we need to manually initialise the wasm module here from wasm import at top of file
//     // await initPngWasm(PNG_DEC_WASM);
//     return decodePng(buffer);
//   }

//   throw new Error(`Unsupported format: ${format}`);
// };

export const processImg3 = async (buffer: ArrayBuffer) => {
  await initJpegDecode(JPEG_DEC_WASM); // JPEG_DEC_WASM is the name of the imported file
  await initEncWebpWasm(ENCODE_WEBP); // JPEG_DEC_WASM is the name of the imported file
  await initResize(RESIZE_WASM);
  const imgData = await decode(buffer);
  // const image = await fetch('./image.jpeg').then(res => res.arrayBuffer()).then(decode);

  // const img = decodeImage(buffer, format)

  // img.
  const resized = await resize(imgData, {
    height: 200,
    width: 200,
  });

  const result = await encodeWebP(resized, {
    quality: 60,
  });

  return result;
};
