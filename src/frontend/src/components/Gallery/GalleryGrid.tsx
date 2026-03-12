import type { GalleryItem } from "@/backend.d";
import { Button } from "@/components/ui/button";
import {
  Download,
  Eye,
  HardDrive,
  ImageIcon,
  Images,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface GalleryGridProps {
  items: GalleryItem[];
  isAdmin: boolean;
  onDelete: (id: string) => void;
  emptyMessage?: string;
  emptySubMessage?: string;
}

const PLACEHOLDER_COLORS = [
  "from-amber-950/60 to-yellow-900/30",
  "from-orange-950/60 to-amber-900/30",
  "from-yellow-950/60 to-orange-900/30",
  "from-stone-900/60 to-amber-950/30",
  "from-neutral-900/60 to-yellow-950/30",
  "from-zinc-900/60 to-amber-900/30",
];

function isDriveUrl(url: string): boolean {
  return url.includes("drive.google.com");
}

function extractDriveFileId(url: string): string | null {
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return idMatch[1];
  return null;
}

function getDriveDirectUrl(url: string): string {
  const fileId = extractDriveFileId(url);
  if (fileId) return `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`;
  return url;
}

function DownloadImageButton({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);

    if (isDriveUrl(url)) {
      const fileId = extractDriveFileId(url);
      if (fileId) {
        window.open(
          `https://drive.google.com/uc?export=download&id=${fileId}`,
          "_blank",
          "noopener,noreferrer",
        );
        toast.success("Download shuru ho gaya!");
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
      }
      setDownloading(false);
      return;
    }

    try {
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error("fetch failed");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      const urlParts = url.split("/");
      const rawFilename = urlParts[urlParts.length - 1].split("?")[0];
      anchor.download = rawFilename || title || "photo";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      toast.success("Photo download ho gaya!");
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
      toast.info(
        "Photo new tab mein khul gayi — save karne ke liye long-press karein.",
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={downloading}
      className="flex items-center gap-1 bg-black/60 hover:bg-black/80 text-white text-xs px-2 py-1 rounded-md transition-colors disabled:opacity-60"
    >
      {downloading ? (
        <span className="animate-spin h-3 w-3 border border-white/50 border-t-white rounded-full" />
      ) : (
        <Download className="h-3 w-3" />
      )}
      {downloading ? "..." : "Save"}
    </button>
  );
}

// ─── Photo Card ───────────────────────────────────────────────────────────────

function PhotoCard({
  item,
  index,
  isAdmin,
  onDelete,
  isFailed,
  onImageError,
}: {
  item: GalleryItem;
  index: number;
  isAdmin: boolean;
  onDelete: (id: string) => void;
  isFailed: boolean;
  onImageError: (id: string) => void;
}) {
  const displayUrl =
    item.imageUrl && isDriveUrl(item.imageUrl)
      ? getDriveDirectUrl(item.imageUrl)
      : item.imageUrl;

  return (
    <motion.div
      key={item.id}
      data-ocid={`gallery.item.${index + 1}`}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
      className="group relative overflow-hidden rounded-xl border border-[oklch(0.25_0.02_91.7)] hover:border-[oklch(0.862_0.196_91.7/0.6)] transition-all duration-300 bg-[oklch(0.1_0_0)]"
    >
      {/* Image or placeholder */}
      {displayUrl && !isFailed ? (
        <img
          src={displayUrl}
          alt={item.title || item.caption}
          className="w-full aspect-video object-cover"
          loading="lazy"
          onError={() => onImageError(item.id)}
        />
      ) : (
        <div
          className={`w-full aspect-video bg-gradient-to-br ${PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length]} flex items-center justify-center`}
        >
          <ImageIcon className="h-10 w-10 text-primary/40" />
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.05_0_0/0.95)] via-[oklch(0.05_0_0/0.4)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 gap-1.5">
        {(item.title || item.caption) && (
          <p className="text-white text-sm font-heading font-semibold line-clamp-1">
            {item.title || item.caption}
          </p>
        )}
        {item.caption && item.title && (
          <p className="text-white/70 text-xs font-body line-clamp-1">
            {item.caption}
          </p>
        )}

        <div className="flex items-center gap-1.5 mt-0.5">
          <button
            type="button"
            onClick={() =>
              window.open(
                isDriveUrl(item.imageUrl)
                  ? `https://drive.google.com/file/d/${extractDriveFileId(item.imageUrl)}/preview`
                  : item.imageUrl,
                "_blank",
                "noopener,noreferrer",
              )
            }
            className="flex items-center gap-1 bg-black/60 hover:bg-black/80 text-white text-xs px-2 py-1 rounded-md transition-colors"
          >
            <Eye className="h-3 w-3" />
            View
          </button>

          <DownloadImageButton url={item.imageUrl} title={item.title} />

          {isAdmin && (
            <Button
              data-ocid={`gallery.delete_button.${index + 1}`}
              size="sm"
              onClick={() => onDelete(item.id)}
              className="ml-auto h-7 px-2 bg-destructive/80 hover:bg-destructive text-white text-xs"
            >
              <Trash2 className="h-3 w-3 mr-1" /> Delete
            </Button>
          )}
        </div>
      </div>

      {/* Title pill on mobile */}
      {item.title && (
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-[oklch(0.05_0_0/0.9)] to-transparent sm:hidden">
          <p className="text-white text-xs font-body line-clamp-1 truncate">
            {item.title}
          </p>
        </div>
      )}
    </motion.div>
  );
}

// ─── Drive Link Card ──────────────────────────────────────────────────────────

function DriveLinkCard({
  item,
  index,
  isAdmin,
  onDelete,
}: {
  item: GalleryItem;
  index: number;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}) {
  const fileId = extractDriveFileId(item.imageUrl);
  // Open the original Drive URL directly so user sees their Drive file
  const openUrl = item.imageUrl;
  const thumbnailUrl = fileId
    ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`
    : null;
  const [thumbFailed, setThumbFailed] = useState(false);

  return (
    <motion.div
      key={item.id}
      data-ocid={`gallery.drive.item.${index + 1}`}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
      className="group relative overflow-hidden rounded-xl border border-emerald-900/40 hover:border-emerald-600/60 transition-all duration-300 bg-[oklch(0.1_0_0)] cursor-pointer"
      onClick={() => window.open(openUrl, "_blank", "noopener,noreferrer")}
    >
      {/* Thumbnail or Drive placeholder */}
      {thumbnailUrl && !thumbFailed ? (
        <img
          src={thumbnailUrl}
          alt={item.title || "Google Drive file"}
          className="w-full aspect-video object-cover"
          loading="lazy"
          onError={() => setThumbFailed(true)}
        />
      ) : (
        <div className="w-full aspect-video bg-gradient-to-br from-emerald-950/70 to-teal-900/30 flex flex-col items-center justify-center gap-2">
          <HardDrive className="h-10 w-10 text-emerald-400/60" />
          <span className="text-emerald-400/50 text-xs font-body">
            Google Drive
          </span>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.05_0_0/0.95)] via-[oklch(0.05_0_0/0.4)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 gap-1.5">
        {(item.title || item.caption) && (
          <p className="text-white text-sm font-heading font-semibold line-clamp-1">
            {item.title || item.caption}
          </p>
        )}
        {item.caption && item.title && (
          <p className="text-white/70 text-xs font-body line-clamp-1">
            {item.caption}
          </p>
        )}

        {/* biome-ignore lint/a11y/useKeyWithClickEvents: stop-propagation wrapper; all children are interactive buttons */}
        <div
          className="flex items-center gap-1.5 mt-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() =>
              window.open(openUrl, "_blank", "noopener,noreferrer")
            }
            className="flex items-center gap-1 bg-emerald-800/70 hover:bg-emerald-700 text-emerald-100 text-xs px-2.5 py-1 rounded-md transition-colors font-heading font-medium"
            data-ocid={`gallery.drive.item.${index + 1}`}
          >
            <Eye className="h-3 w-3" />
            Open in Drive
          </button>
          <DownloadImageButton url={item.imageUrl} title={item.title} />
          {isAdmin && (
            <Button
              data-ocid={`gallery.drive.delete_button.${index + 1}`}
              size="sm"
              onClick={() => onDelete(item.id)}
              className="ml-auto h-7 px-2 bg-destructive/80 hover:bg-destructive text-white text-xs"
            >
              <Trash2 className="h-3 w-3 mr-1" /> Delete
            </Button>
          )}
        </div>
      </div>

      {/* Drive badge always visible */}
      <div className="absolute top-2 left-2 flex items-center gap-1 bg-emerald-900/80 text-emerald-300 text-[10px] font-heading font-semibold px-2 py-0.5 rounded-full border border-emerald-700/40">
        <HardDrive className="h-2.5 w-2.5" />
        Drive
      </div>

      {/* Title pill on mobile */}
      {item.title && (
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-[oklch(0.05_0_0/0.9)] to-transparent sm:hidden">
          <p className="text-white text-xs font-body line-clamp-1 truncate">
            {item.title}
          </p>
        </div>
      )}
    </motion.div>
  );
}

// ─── Column sub-section header ────────────────────────────────────────────────

function ColumnHeading({
  icon: Icon,
  label,
  count,
  colorClass,
  borderClass,
}: {
  icon: React.ElementType;
  label: string;
  count: number;
  colorClass: string;
  borderClass: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 mb-3 pb-2 border-b ${borderClass}`}
    >
      <Icon className={`h-4 w-4 ${colorClass}`} />
      <span className={`text-sm font-heading font-semibold ${colorClass}`}>
        {label}
      </span>
      <span
        className={`ml-auto text-xs font-body px-2 py-0.5 rounded-full border ${borderClass} ${colorClass}`}
      >
        {count}
      </span>
    </div>
  );
}

// ─── Empty mini-state ─────────────────────────────────────────────────────────

function MiniEmpty({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 rounded-lg border border-dashed border-[oklch(0.22_0.01_91.7)] bg-[oklch(0.08_0_0/0.5)]">
      <p className="text-muted-foreground/50 text-xs font-body text-center">
        {message}
      </p>
    </div>
  );
}

// ─── Main GalleryGrid ─────────────────────────────────────────────────────────

export default function GalleryGrid({
  items,
  isAdmin,
  onDelete,
  emptyMessage = "No photos yet",
  emptySubMessage = "Admin uploads photos here and they appear for everyone.",
}: GalleryGridProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (id: string) => {
    setFailedImages((prev) => new Set([...prev, id]));
  };

  // Split items into photos vs drive links
  const photoItems = items.filter((item) => !isDriveUrl(item.imageUrl));
  const driveItems = items.filter((item) => isDriveUrl(item.imageUrl));

  if (items.length === 0) {
    return (
      <div
        data-ocid="gallery.empty_state"
        className="text-center py-16 dark-card rounded-xl border border-[oklch(0.25_0.02_91.7)]"
      >
        <ImageIcon className="h-12 w-12 text-primary/30 mx-auto mb-4" />
        <p className="text-muted-foreground font-body text-lg">
          {emptyMessage}
        </p>
        <p className="text-muted-foreground/60 font-body text-sm mt-2">
          {emptySubMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ── Photos column ── */}
      <div className="min-w-0">
        <ColumnHeading
          icon={Images}
          label="Photos"
          count={photoItems.length}
          colorClass="text-primary"
          borderClass="border-[oklch(0.862_0.196_91.7/0.25)]"
        />
        {photoItems.length === 0 ? (
          <MiniEmpty message="No photos uploaded yet" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {photoItems.map((item, i) => (
              <PhotoCard
                key={item.id}
                item={item}
                index={i}
                isAdmin={isAdmin}
                onDelete={onDelete}
                isFailed={failedImages.has(item.id)}
                onImageError={handleImageError}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Google Drive Links column ── */}
      <div className="min-w-0">
        <ColumnHeading
          icon={HardDrive}
          label="Google Drive Links"
          count={driveItems.length}
          colorClass="text-emerald-400"
          borderClass="border-emerald-900/40"
        />
        {driveItems.length === 0 ? (
          <MiniEmpty message="No Google Drive links added yet" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {driveItems.map((item, i) => (
              <DriveLinkCard
                key={item.id}
                item={item}
                index={i}
                isAdmin={isAdmin}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
