import sharp from "sharp";

export type ImageProcessOpts = {
  quality?: number;
  resize?: {
    width?: number;
    height?: number;
    fit?: string;
    position?: string;
  };
};

export async function processImage(
  image: File,
  name: string,
  imgOpts: ImageProcessOpts
): Promise<{ img: Buffer; name: string } | null> {
  try {
    const data = await image.arrayBuffer();
    const pipeline = sharp(data);

    if (imgOpts?.resize) pipeline.resize(imgOpts.resize as any);

    pipeline.jpeg({
      quality: imgOpts?.quality ?? 100,
    });

    const processedImg = await pipeline.toBuffer();
    const processedName = `${name}.jpg`;
    return {
      img: processedImg,
      name: processedName,
    };
  } catch {
    return null;
  }
}
export function getImageName(baseName: string) {
  // will add extension to it basically

  return `${baseName}.jpg`;
}

// export const

/**
 * move.from should point to tmp location, relative to static
 * move.to should point to a file with .jpg extension, relative to static
 */

export const PROFILE_IMAGE_OPTS = {
  quality: 90,
  resize: {
    width: 300,
    height: 300,
    fit: "cover",
    position: "center",
  },
};

export const DOCUMENT_IMAGE_OPTS = {
  quality: 90,
  resize: {
    width: 1000,
    height: 1000,
    fit: "inside",
    // position: "center",
  },
};
