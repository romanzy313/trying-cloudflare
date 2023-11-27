// @ts-ignore
import Jimp from "jimp/es";

export function processImg3(buffer: Buffer) {
  Jimp.read(buffer)
    .then((image) => {
      // Do stuff with the image.
    })
    .catch((err) => {
      // Handle an exception.
    });
}
