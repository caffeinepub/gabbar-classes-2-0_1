import type { Faculty } from "@/backend.d";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, User } from "lucide-react";
import { motion } from "motion/react";

interface FacultyCardProps {
  faculty: Faculty;
  index: number;
  isAdmin: boolean;
  onEdit: (faculty: Faculty) => void;
  onDelete: (id: string) => void;
}

export default function FacultyCard({
  faculty,
  index,
  isAdmin,
  onEdit,
  onDelete,
}: FacultyCardProps) {
  const initials = faculty.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      data-ocid={`faculty.item.${index}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index - 1) * 0.1 }}
      className="dark-card rounded-xl p-5 border border-[oklch(0.862_0.196_91.7/0.2)] hover:border-[oklch(0.862_0.196_91.7/0.6)] hover:shadow-gold-sm transition-all duration-300 group"
    >
      {/* Avatar */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative flex-shrink-0">
          {faculty.photoUrl ? (
            <img
              src={faculty.photoUrl}
              alt={faculty.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[oklch(0.862_0.196_91.7/0.4)]"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[oklch(0.862_0.196_91.7/0.2)] to-[oklch(0.75_0.16_84/0.1)] border-2 border-[oklch(0.862_0.196_91.7/0.4)] flex items-center justify-center">
              <span className="text-primary font-display font-bold text-xl">
                {initials}
              </span>
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <User className="h-2.5 w-2.5 text-primary-foreground" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-foreground font-heading font-bold text-base truncate group-hover:text-primary transition-colors">
            {faculty.name}
          </h3>
          <p className="text-primary text-sm font-body font-medium">
            {faculty.subject}
          </p>
          <p className="text-muted-foreground text-xs font-body mt-0.5 truncate">
            {faculty.qualification}
          </p>
        </div>
      </div>

      {/* Bio */}
      {faculty.bio && (
        <p className="text-muted-foreground text-sm font-body leading-relaxed line-clamp-3 border-t border-[oklch(0.25_0.02_91.7)] pt-3">
          {faculty.bio}
        </p>
      )}

      {/* Admin Controls */}
      {isAdmin && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-[oklch(0.25_0.02_91.7)]">
          <Button
            data-ocid={`faculty.edit_button.${index}`}
            size="sm"
            variant="outline"
            onClick={() => onEdit(faculty)}
            className="flex-1 border-[oklch(0.862_0.196_91.7/0.3)] text-primary hover:bg-[oklch(0.862_0.196_91.7/0.1)] text-xs"
          >
            <Pencil className="h-3 w-3 mr-1" /> Edit
          </Button>
          <Button
            data-ocid={`faculty.delete_button.${index}`}
            size="sm"
            variant="outline"
            onClick={() => onDelete(faculty.id)}
            className="border-destructive/40 text-destructive hover:bg-destructive/10 text-xs"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}
