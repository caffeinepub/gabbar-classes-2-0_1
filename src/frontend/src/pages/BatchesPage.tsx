import type { Batch } from "@/backend.d";
import AdmissionForm from "@/components/Batches/AdmissionForm";
import BatchCard from "@/components/Batches/BatchCard";
import BatchForm from "@/components/Batches/BatchForm";
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
  useAddBatch,
  useAllBatches,
  useDeleteBatch,
  useIsAdmin,
  useUpdateBatch,
} from "@/hooks/useQueries";
import { CalendarDays, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function BatchesPage() {
  const { data: batches = [], isLoading } = useAllBatches();
  const { data: isAdmin } = useIsAdmin();
  const addBatch = useAddBatch();
  const updateBatch = useUpdateBatch();
  const deleteBatch = useDeleteBatch();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

  const handleAdd = async (data: Batch) => {
    try {
      await addBatch.mutateAsync(data);
      toast.success("Batch added successfully!");
      setDialogOpen(false);
    } catch {
      toast.error("Failed to add batch.");
    }
  };

  const handleUpdate = async (data: Batch) => {
    if (!editingBatch) return;
    try {
      await updateBatch.mutateAsync({ id: editingBatch.id, data });
      toast.success("Batch updated!");
      setEditingBatch(null);
      setDialogOpen(false);
    } catch {
      toast.error("Failed to update.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBatch.mutateAsync(id);
      toast.success("Batch removed.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const handleEdit = (b: Batch) => {
    setEditingBatch(b);
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
          className="text-center mb-16"
        >
          <p className="text-primary/70 font-body text-sm tracking-widest uppercase mb-3">
            Schedule & Fees
          </p>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-gold-gradient section-heading section-heading-center">
            Batches & Admission
          </h1>
          <p className="text-muted-foreground font-body mt-6 max-w-2xl mx-auto">
            Join our well-structured batches designed for focused learning.
          </p>
        </motion.div>

        {/* Batches Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-gold-gradient">
              Current Batches
            </h2>
            {isAdmin && (
              <Dialog
                open={dialogOpen}
                onOpenChange={(o) => {
                  setDialogOpen(o);
                  if (!o) setEditingBatch(null);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    data-ocid="batches.add.open_modal_button"
                    className="bg-primary text-primary-foreground hover:bg-gold-light font-heading font-semibold"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Batch
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[oklch(0.13_0_0)] border-[oklch(0.3_0.02_91.7)] max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-gold-gradient font-display text-xl">
                      {editingBatch ? "Edit Batch" : "Add New Batch"}
                    </DialogTitle>
                  </DialogHeader>
                  <BatchForm
                    initial={editingBatch ?? undefined}
                    onSubmit={editingBatch ? handleUpdate : handleAdd}
                    onCancel={() => {
                      setDialogOpen(false);
                      setEditingBatch(null);
                    }}
                    isLoading={addBatch.isPending || updateBatch.isPending}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>

          {isLoading && (
            <div
              data-ocid="batches.loading_state"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-44 rounded-xl bg-[oklch(0.15_0_0)]"
                />
              ))}
            </div>
          )}

          {!isLoading && batches.length === 0 && (
            <div
              data-ocid="batches.empty_state"
              className="text-center py-16 dark-card rounded-xl border border-[oklch(0.25_0.02_91.7)]"
            >
              <CalendarDays className="h-12 w-12 text-primary/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-body text-lg">
                Batch details coming soon
              </p>
              {isAdmin && (
                <p className="text-muted-foreground/60 font-body text-sm mt-2">
                  Add batches using the button above.
                </p>
              )}
            </div>
          )}

          {!isLoading && batches.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {batches.map((batch, i) => (
                <BatchCard
                  key={batch.id}
                  batch={batch}
                  index={i + 1}
                  isAdmin={!!isAdmin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Admission Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="dark-card rounded-2xl border border-[oklch(0.862_0.196_91.7/0.3)] p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-gold-gradient section-heading section-heading-center">
              Admission Inquiry
            </h2>
            <p className="text-muted-foreground font-body mt-4">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            <AdmissionForm />
          </div>
        </motion.div>
      </div>
    </main>
  );
}
