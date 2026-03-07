import type { ClassContent } from "@/backend.d";
import { Button } from "@/components/ui/button";
import { ContentType } from "@/hooks/useQueries";
import {
  ClipboardList,
  ExternalLink,
  FileText,
  FileX,
  MessageSquare,
  PenTool,
  Trash2,
  Video,
} from "lucide-react";
import { motion } from "motion/react";

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

export default function ContentList({
  items,
  contentType,
  isAdmin,
  onDelete,
}: ContentListProps) {
  const Icon = CONTENT_ICONS[contentType];
  const iconColor = CONTENT_COLORS[contentType];

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
            {item.body && contentType === ContentType.message && (
              <p className="text-foreground/80 text-sm font-body mt-2 p-3 bg-[oklch(0.1_0_0)] rounded-lg border-l-2 border-primary/40">
                {item.body}
              </p>
            )}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                download={
                  contentType === ContentType.pdf ||
                  contentType === ContentType.worksheet
                    ? true
                    : undefined
                }
                className="inline-flex items-center gap-1 text-primary text-xs font-body mt-1.5 hover:text-gold-light transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                {contentType === ContentType.pdf ||
                contentType === ContentType.worksheet
                  ? "Download File"
                  : "Open Resource"}
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
