import type { Batch } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  IndianRupee,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

interface BatchCardProps {
  batch: Batch;
  index: number;
  isAdmin: boolean;
  onEdit: (batch: Batch) => void;
  onDelete: (id: string) => void;
}

export default function BatchCard({
  batch,
  index,
  isAdmin,
  onEdit,
  onDelete,
}: BatchCardProps) {
  return (
    <motion.div
      data-ocid={`batches.item.${index}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index - 1) * 0.1 }}
      className="dark-card rounded-xl border-l-4 border-l-primary border border-[oklch(0.25_0.02_91.7)] hover:border-[oklch(0.862_0.196_91.7/0.4)] transition-all duration-300 hover:shadow-gold-sm group"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-foreground font-heading font-bold text-base group-hover:text-primary transition-colors">
              {batch.batchName}
            </h3>
            <p className="text-primary text-sm font-body">{batch.className}</p>
          </div>
          <Badge
            className={
              batch.isActive
                ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                : "bg-muted text-muted-foreground"
            }
          >
            {batch.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-primary/70 flex-shrink-0" />
            <span className="text-sm text-muted-foreground font-body truncate">
              {batch.timing}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-primary/70 flex-shrink-0" />
            <span className="text-sm text-muted-foreground font-body truncate">
              {batch.schedule}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee className="h-3.5 w-3.5 text-primary/70 flex-shrink-0" />
            <span className="text-sm text-foreground font-body font-semibold">
              ₹{Number(batch.fee).toLocaleString("en-IN")}/month
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-primary/70 flex-shrink-0" />
            <span className="text-sm text-muted-foreground font-body">
              {Number(batch.availableSeats)}/{Number(batch.totalSeats)} seats
            </span>
          </div>
        </div>

        {isAdmin && (
          <div className="flex gap-2 mt-4 pt-3 border-t border-[oklch(0.25_0.02_91.7)]">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(batch)}
              className="flex-1 border-[oklch(0.862_0.196_91.7/0.3)] text-primary hover:bg-[oklch(0.862_0.196_91.7/0.1)] text-xs"
            >
              <Pencil className="h-3 w-3 mr-1" /> Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(batch.id)}
              className="border-destructive/40 text-destructive hover:bg-destructive/10 text-xs"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
