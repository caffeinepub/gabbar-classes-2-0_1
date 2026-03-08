import type { ClassContent } from "@/backend.d";
import { Button } from "@/components/ui/button";
import { ContentType } from "@/hooks/useQueries";
import {
  ClipboardList,
  Download,
  ExternalLink,
  Eye,
  FileText,
  FileX,
  Loader2,
  MessageSquare,
  PenTool,
  Trash2,
  Video,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface ContentListProps {
  items: ClassContent[];
  contentType: ContentType;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

const CONTENT_ICONS: Record<ContentType, typeof FileText> = {
  [ContentType.pdf]: FileText,
  [ContentType.worksheet]: PenTool,
  [ContentType.message]: MessageSquare,
  [ContentType.video]: Video,
  [ContentType.test]: ClipboardList,
};

const CONTENT_COLORS: Record<ContentType, string> = {
  [ContentType.pdf]: "text-rose-400",
  [ContentType.worksheet]: "text-amber-400",
  [ContentType.message]: "text-emerald-400",
  [ContentType.video]: "text-blue-400",
  [ContentType.test]: "text-purple-400",
};

/**
 * Extract Google Drive file ID from a share link.
 * Handles patterns like:
 *   https://drive.google.com/file/d/FILE_ID/view
 *   https://drive.google.com/open?id=FILE_ID
 *   https://drive.google.com/uc?id=FILE_ID
 */
function extractDriveFileId(url: string): string | null {
  // Pattern: /file/d/{id}/
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];

  // Pattern: ?id={id} or &id={id}
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return idMatch[1];

  return null;
}

function isDriveUrl(url: string): boolean {
  return url.includes("drive.google.com");
}

const openFile = (url: string) => {
  // Handle Google Drive links
  if (isDriveUrl(url)) {
    const fileId = extractDriveFileId(url);
    if (fileId) {
      // Use the preview URL for embedded view
      const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      window.open(previewUrl, "_blank", "noopener,noreferrer");
    } else {
      // Fallback: open the Drive URL directly
      window.open(url, "_blank", "noopener,noreferrer");
    }
    return;
  }

  const lower = url.toLowerCase().split("?")[0];
  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(lower);

  if (isImage) {
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    // PDF, Doc, Docx and other files — use Google Docs viewer
    const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}`;
    window.open(viewerUrl, "_blank", "noopener,noreferrer");
  }
};

function DownloadButton({ url, title }: { url: string; title: string }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);

    // For Google Drive links, use the direct download URL
    if (isDriveUrl(url)) {
      const fileId = extractDriveFileId(url);
      if (fileId) {
        const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        window.open(downloadUrl, "_blank", "noopener,noreferrer");
        toast.success("Download shuru ho gaya! Files mein dekhen.");
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
        toast.info("File new tab mein khul gayi.");
      }
      setDownloading(false);
      return;
    }

    try {
      // Try fetch + blob for proper file download (saves to device files/gallery)
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error("fetch failed");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      // Determine filename from URL or use title
      const urlParts = url.split("/");
      const rawFilename = urlParts[urlParts.length - 1].split("?")[0];
      anchor.download = rawFilename || title || "download";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      toast.success("Download ho gaya! Files mein dekhen.");
    } catch {
      // Fallback: open in new tab (user can long-press to save)
      window.open(url, "_blank", "noopener,noreferrer");
      toast.info(
        "File new tab mein khul gayi. Save karne ke liye long-press karein.",
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      data-ocid="class.content.download_button"
      size="sm"
      variant="outline"
      onClick={handleDownload}
      disabled={downloading}
      className="h-7 px-2.5 text-xs border-[oklch(0.3_0.02_91.7)] text-amber-400 hover:text-amber-300 hover:border-amber-400/50 hover:bg-amber-400/10 font-body transition-all"
    >
      {downloading ? (
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
      ) : (
        <Download className="h-3 w-3 mr-1" />
      )}
      {downloading ? "Downloading…" : "Download"}
    </Button>
  );
}

export default function ContentList({
  items,
  contentType,
  isAdmin,
  onDelete,
}: ContentListProps) {
  const Icon = CONTENT_ICONS[contentType];
  const iconColor = CONTENT_COLORS[contentType];

  const isFileType =
    contentType === ContentType.pdf || contentType === ContentType.worksheet;

  if (items.length === 0) {
    return (
      <div
        data-ocid="class.content.empty_state"
        className="text-center py-12 dark-card rounded-xl border border-[oklch(0.25_0.02_91.7)]"
      >
        <FileX className="h-10 w-10 text-primary/30 mx-auto mb-3" />
        <p className="text-muted-foreground font-body">Content coming soon</p>
        <p className="text-muted-foreground/60 text-sm font-body mt-1">
          {isAdmin
            ? "Use the Add Content button to upload resources."
            : "Check back later for updates."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          data-ocid={`class.content.item.${i + 1}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="flex items-start gap-3 p-4 dark-card rounded-xl border border-[oklch(0.25_0.02_91.7)] hover:border-[oklch(0.862_0.196_91.7/0.4)] transition-all group"
        >
          <div className="w-9 h-9 rounded-lg bg-[oklch(0.18_0_0)] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-foreground font-heading font-semibold text-sm truncate group-hover:text-primary transition-colors">
              {item.title}
            </h4>
            {item.description && (
              <p className="text-muted-foreground text-xs font-body mt-0.5 line-clamp-2">
                {item.description}
              </p>
            )}

            {/* Message body — inline display */}
            {item.body && contentType === ContentType.message && (
              <p className="text-foreground/80 text-sm font-body mt-2 p-3 bg-[oklch(0.1_0_0)] rounded-lg border-l-2 border-primary/40">
                {item.body}
              </p>
            )}

            {/* Image thumbnail preview if content is an image file (non-Drive) */}
            {item.url &&
              isFileType &&
              !isDriveUrl(item.url) &&
              /\.(jpg|jpeg|png|gif|webp)$/i.test(
                item.url.toLowerCase().split("?")[0],
              ) && (
                <div className="mt-2 rounded-lg overflow-hidden border border-[oklch(0.25_0.02_91.7)] max-w-xs">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-auto max-h-48 object-contain bg-[oklch(0.1_0_0)]"
                  />
                </div>
              )}

            {/* PDF / Worksheet — View + Download buttons */}
            {item.url && isFileType && (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Button
                  data-ocid="class.content.view_button"
                  size="sm"
                  variant="outline"
                  onClick={() => openFile(item.url!)}
                  className="h-7 px-2.5 text-xs border-[oklch(0.3_0.02_91.7)] text-primary hover:text-gold-light hover:border-primary/50 hover:bg-primary/10 font-body transition-all"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <DownloadButton url={item.url} title={item.title} />
                {isDriveUrl(item.url) && (
                  <span className="text-emerald-500/70 text-xs font-body flex items-center gap-1">
                    Google Drive
                  </span>
                )}
              </div>
            )}

            {/* Video / Test — single Open link */}
            {item.url && !isFileType && contentType !== ContentType.message && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="class.content.link"
                className="inline-flex items-center gap-1 text-primary text-xs font-body mt-1.5 hover:text-gold-light transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Open Resource
              </a>
            )}
          </div>

          {isAdmin && (
            <Button
              data-ocid={`class.content.delete_button.${i + 1}`}
              size="sm"
              variant="ghost"
              onClick={() => onDelete(item.id)}
              className="text-destructive hover:bg-destructive/10 flex-shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </motion.div>
      ))}
    </div>
  );
}
