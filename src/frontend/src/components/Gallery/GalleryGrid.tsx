import type { GalleryItem } from "@/backend.d";
import { Button } from "@/components/ui/button";
import { ImageIcon, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface GalleryGridProps {
  items: GalleryItem[];
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

const PLACEHOLDER_COLORS = [
  "from-amber-950/60 to-yellow-900/30",
  "from-orange-950/60 to-amber-900/30",
  "from-yellow-950/60 to-orange-900/30",
  "from-stone-900/60 to-amber-950/30",
  "from-neutral-900/60 to-yellow-950/30",
  "from-zinc-900/60 to-amber-900/30",
];

export default function GalleryGrid({
  items,
  isAdmin,
  onDelete,
}: GalleryGridProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (id: string) => {
    setFailedImages((prev) => new Set([...prev, id]));
  };

  if (items.length === 0) {
    return (
      <div
        data-ocid="gallery.empty_state"
        className="text-center py-20 dark-card rounded-xl border border-[oklch(0.25_0.02_91.7)]"
      >
        <ImageIcon className="h-12 w-12 text-primary/30 mx-auto mb-4" />
        <p className="text-muted-foreground font-body text-lg">No photos yet</p>
        <p className="text-muted-foreground/60 font-body text-sm mt-2">
          Admin uploads coaching centre photos here and they appear for everyone
          permanently.
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          data-ocid={`gallery.item.${i + 1}`}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
          className="break-inside-avoid group relative overflow-hidden rounded-xl border border-[oklch(0.25_0.02_91.7)] hover:border-[oklch(0.862_0.196_91.7/0.6)] transition-all duration-300"
        >
          {item.imageUrl && !failedImages.has(item.id) ? (
            <img
              src={item.imageUrl}
              alt={item.title || item.caption}
              className="w-full object-cover"
              loading="lazy"
              onError={() => handleImageError(item.id)}
            />
          ) : (
            <div
              className={`w-full bg-gradient-to-br ${PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length]} flex items-center justify-center`}
              style={{ height: `${160 + (i % 3) * 60}px` }}
            >
              <ImageIcon className="h-10 w-10 text-primary/40" />
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.06_0_0/0.9)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
            {(item.title || item.caption) && (
              <p className="text-white text-sm font-body line-clamp-2 mb-1">
                {item.title || item.caption}
              </p>
            )}
            {isAdmin && (
              <Button
                data-ocid={`gallery.delete_button.${i + 1}`}
                size="sm"
                onClick={() => onDelete(item.id)}
                className="w-full bg-destructive/80 hover:bg-destructive text-white text-xs mt-1"
              >
                <Trash2 className="h-3 w-3 mr-1" /> Delete
              </Button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
