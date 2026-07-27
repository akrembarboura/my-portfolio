import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2, Upload } from 'lucide-react';
import { compressImage } from '../../utils/image';
import { cn } from '../../utils/cn';

interface ImageUploadProps {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
  aspect?: 'square' | 'video' | 'wide';
  className?: string;
}

const aspects = {
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[21/9]',
};

export default function ImageUpload({
  value,
  onChange,
  label,
  aspect = 'video',
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setLoading(true);
    try {
      const compressed = await compressImage(file);
      onChange(compressed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">
          {label}
        </span>
      )}
      <div
        className={cn(
          'group relative flex items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/40 transition-colors hover:border-gold-400',
          aspects[aspect]
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files?.[0]);
        }}
      >
        {value ? (
          <>
            <img src={value} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-stone-900/50 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-stone-900 hover:bg-white"
              >
                <Upload className="mr-1 inline h-3.5 w-3.5" />
                Remplacer
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500"
              >
                <Trash2 className="mr-1 inline h-3.5 w-3.5" />
                Retirer
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center gap-2 p-6 text-stone-400"
          >
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
            ) : (
              <ImagePlus className="h-8 w-8" />
            )}
            <span className="text-sm">
              {loading ? 'Compression…' : 'Cliquez ou glissez une image'}
            </span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
