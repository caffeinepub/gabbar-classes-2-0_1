import type { Faculty } from "@/backend.d";
import FacultyCard from "@/components/Faculty/FacultyCard";
import FacultyForm from "@/components/Faculty/FacultyForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddFaculty,
  useAllFaculty,
  useDeleteFaculty,
  useIsAdmin,
  useUpdateFaculty,
} from "@/hooks/useQueries";
import { Plus, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function FacultyPage() {
  const { data: faculty = [], isLoading } = useAllFaculty();
  const { data: isAdmin } = useIsAdmin();
  const addFaculty = useAddFaculty();
  const updateFaculty = useUpdateFaculty();
  const deleteFaculty = useDeleteFaculty();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);

  const handleAdd = async (data: Faculty) => {
    try {
      await addFaculty.mutateAsync(data);
      toast.success("Faculty member added successfully!");
      setDialogOpen(false);
    } catch {
      toast.error("Failed to add faculty member.");
    }
  };

  const handleUpdate = async (data: Faculty) => {
    if (!editingFaculty) return;
    try {
      await updateFaculty.mutateAsync({ id: editingFaculty.id, data });
      toast.success("Faculty updated successfully!");
      setEditingFaculty(null);
      setDialogOpen(false);
    } catch {
      toast.error("Failed to update faculty.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFaculty.mutateAsync(id);
      toast.success("Faculty member removed.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const handleEdit = (f: Faculty) => {
    setEditingFaculty(f);
    setDialogOpen(true);
  };

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
        >
          <div>
            <p className="text-primary/70 font-body text-sm tracking-widest uppercase mb-2">
              Our Team
            </p>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-gold-gradient section-heading">
              Faculty
            </h1>
          </div>
          {isAdmin && (
            <Dialog
              open={dialogOpen}
              onOpenChange={(o) => {
                setDialogOpen(o);
                if (!o) setEditingFaculty(null);
              }}
            >
              <DialogTrigger asChild>
                <Button
                  data-ocid="faculty.add.open_modal_button"
                  className="bg-primary text-primary-foreground hover:bg-gold-light font-heading font-semibold"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Faculty
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[oklch(0.13_0_0)] border-[oklch(0.3_0.02_91.7)] max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-gold-gradient font-display text-xl">
                    {editingFaculty ? "Edit Faculty" : "Add Faculty Member"}
                  </DialogTitle>
                </DialogHeader>
                <FacultyForm
                  initial={editingFaculty ?? undefined}
                  onSubmit={editingFaculty ? handleUpdate : handleAdd}
                  onCancel={() => {
                    setDialogOpen(false);
                    setEditingFaculty(null);
                  }}
                  isLoading={addFaculty.isPending || updateFaculty.isPending}
                />
              </DialogContent>
            </Dialog>
          )}
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div
            data-ocid="faculty.loading_state"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton
                key={i}
                className="h-48 rounded-xl bg-[oklch(0.15_0_0)]"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && faculty.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 dark-card rounded-xl border border-[oklch(0.25_0.02_91.7)]"
            data-ocid="faculty.empty_state"
          >
            <Users className="h-12 w-12 text-primary/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-body text-lg">
              Faculty details coming soon
            </p>
            {isAdmin && (
              <p className="text-muted-foreground/60 font-body text-sm mt-2">
                Click "Add Faculty" to add your first faculty member.
              </p>
            )}
          </motion.div>
        )}

        {/* Faculty Grid */}
        {!isLoading && faculty.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {faculty.map((f, i) => (
              <FacultyCard
                key={f.id}
                faculty={f}
                index={i + 1}
                isAdmin={!!isAdmin}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
