/**
 * Client-side image compression + conversion to a data URL.
 * Keeps the admin fully functional without a storage backend; the resulting
 * data URL can be persisted directly or swapped for a real upload later.
 */
export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export function compressImage(
  file: File,
  { maxWidth = 1600, maxHeight = 1600, quality = 0.82 }: CompressOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Le fichier doit être une image.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas non supporté.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        // SVGs and GIFs are passed through as-is to preserve them.
        const outputType =
          file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        resolve(canvas.toDataURL(outputType, quality));
      };
      img.onerror = () => reject(new Error("Impossible de lire l'image."));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier.'));
    reader.readAsDataURL(file);
  });
}

/** Read a file into a plain data URL without compression. */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier.'));
    reader.readAsDataURL(file);
  });
}
