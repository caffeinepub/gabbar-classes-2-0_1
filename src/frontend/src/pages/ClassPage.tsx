import type { ClassContent } from "@/backend.d";
import ContentForm from "@/components/Classes/ContentForm";
import ContentTabs from "@/components/Classes/ContentTabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import {
  ClassLevel,
  useAddClassContent,
  useClassContent,
  useDeleteClassContent,
  useIsAdmin,
} from "@/hooks/useQueries";
import { useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const CLASS_LEVEL_MAP: Record<string, ClassLevel> = {
  Nursery: ClassLevel.Nursery,
  Class1: ClassLevel.Class1,
  Class2: ClassLevel.Class2,
  Class3: ClassLevel.Class3,
  Class4: ClassLevel.Class4,
  Class5: ClassLevel.Class5,
  Class6: ClassLevel.Class6,
  Class7: ClassLevel.Class7,
  Class8: ClassLevel.Class8,
};

const CLASS_LABELS: Record<string, string> = {
  Nursery: "Nursery",
  Class1: "Class 1",
  Class2: "Class 2",
  Class3: "Class 3",
  Class4: "Class 4",
  Class5: "Class 5",
  Class6: "Class 6",
  Class7: "Class 7",
  Class8: "Class 8",
};

export default function ClassPage() {
  const { classLevel: rawLevel } = useParams({ from: "/classes/$classLevel" });
  const classLevel = CLASS_LEVEL_MAP[rawLevel] ?? ClassLevel.Nursery;
  const displayLabel = CLASS_LABELS[rawLevel] ?? rawLevel;

  const { isFetching: actorFetching } = useActor();
  const { data: contents = [], isLoading } = useClassContent(classLevel);
  const { data: isAdmin } = useIsAdmin();
  const addContent = useAddClassContent();
  const deleteContent = useDeleteClassContent();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAdd = async (content: ClassContent) => {
    try {
      await addContent.mutateAsync(content);
      toast.success("Content added successfully!");
      setDialogOpen(false);
    } catch {
      toast.error("Failed to add content.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContent.mutateAsync({ id, classLevel });
      toast.success("Content removed.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back nav */}
        <Link
          to="/library"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-body text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Library
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <p className="text-primary/70 font-body text-sm tracking-widest uppercase mb-2">
              CBSE · Study Materials
            </p>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-gold-gradient section-heading">
              {displayLabel}
            </h1>
          </div>

          {isAdmin && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  data-ocid="class.content.add.open_modal_button"
                  className="bg-primary text-primary-foreground hover:bg-gold-light font-heading font-semibold"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Content
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[oklch(0.13_0_0)] border-[oklch(0.3_0.02_91.7)] max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-gold-gradient font-display text-xl">
                    Add Content for {displayLabel}
                  </DialogTitle>
                </DialogHeader>
                <ContentForm
                  classLevel={classLevel}
                  onSubmit={handleAdd}
                  onCancel={() => setDialogOpen(false)}
                  isLoading={addContent.isPending}
                />
              </DialogContent>
            </Dialog>
          )}
        </motion.div>

        {/* Loading */}
        {(actorFetching || isLoading) && (
          <div data-ocid="class.content.loading_state" className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="h-20 rounded-xl bg-[oklch(0.15_0_0)]"
              />
            ))}
          </div>
        )}

        {/* Content Tabs */}
        {!actorFetching && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ContentTabs
              classLevel={classLevel}
              contents={contents}
              isAdmin={!!isAdmin}
              onDelete={handleDelete}
            />
          </motion.div>
        )}
      </div>
    </main>
  );
}
