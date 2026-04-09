/**
 * Compress and convert an image to WebP before upload.
 * - Max width: 1200px
 * - Format: WebP
 * - Quality: 0.80
 * - Target: < 300 Ko
 */

const MAX_WIDTH = 800;
const INITIAL_QUALITY = 0.75;
const TARGET_SIZE = 70 * 1024; // 70 Ko max

export async function compressImage(file: File): Promise<File> {
  // Skip non-image files
  if (!file.type.startsWith("image/")) return file;

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Impossible de lire l'image"));
      img.src = objectUrl;
    });

    const scale = Math.min(1, MAX_WIDTH / image.naturalWidth);
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas indisponible");

    ctx.drawImage(image, 0, 0, width, height);

    // Try WebP at initial quality
    let blob = await canvasToBlob(canvas, "image/webp", INITIAL_QUALITY);

    // If still too large, reduce quality progressively
    let quality = INITIAL_QUALITY;
    while (blob && blob.size > TARGET_SIZE && quality > 0.2) {
      quality -= 0.05;
      blob = await canvasToBlob(canvas, "image/webp", quality);
    }

    if (!blob) throw new Error("Compression impossible");

    const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${baseName}.webp`, { type: "image/webp" });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/** Standard upload options with 1-year cache */
export const UPLOAD_OPTIONS = {
  cacheControl: "31536000",
  upsert: false,
} as const;
