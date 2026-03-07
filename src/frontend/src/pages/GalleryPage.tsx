import type { GalleryItem } from "@/backend.d";
import GalleryGrid from "@/components/Gallery/GalleryGrid";
import PhotoUploader from "@/components/Gallery/PhotoUploader";
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
  useAddGalleryItem,
  useAllGalleryItems,
  useDeleteGalleryItem,
  useIsAdmin,
} from "@/hooks/useQueries";
import { Loader2, Plus, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

function generateId() {
  return `gal_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export default function GalleryPage() {
  const { isFetching: actorFetching } = useActor();
  const {
    data: items = [],
    isLoading,
    refetch,
    isFetching: galleryFetching,
  } = useAllGalleryItems();
  const { data: isAdmin } = useIsAdmin();
  const addItem = useAddGalleryItem();
  const deleteItem = useDeleteGalleryItem();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleUpload = async (data: {
    title: string;
    caption: string;
    imageUrl: string;
  }) => {
    try {
      const item: GalleryItem = {
        id: generateId(),
        title: data.title,
        caption: data.caption,
        imageUrl: data.imageUrl,
        uploadedAt: BigInt(Date.now()),
      };
      await addItem.mutateAsync(item);
      toast.success("Photo added to gallery!");
      setDialogOpen(false);
    } catch {
      toast.error("Failed to add photo.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem.mutateAsync(id);
      toast.success("Photo removed.");
    } catch {
      toast.error("Failed to delete photo.");
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Gallery refreshed!");
  };

  const showLoading = actorFetching || isLoading;

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
        >
          <div>
            <p className="text-primary/70 font-body text-sm tracking-widest uppercase mb-2">
              Our Moments
            </p>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-gold-gradient section-heading">
              Gallery
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Refresh button — visible to everyone */}
            <Button
              data-ocid="gallery.refresh.button"
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={galleryFetching}
              className="border-[oklch(0.3_0.02_91.7)] text-muted-foreground hover:text-foreground hover:border-primary/50 font-heading"
            >
              {galleryFetching ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-1.5" />
              )}
              Refresh
            </Button>

            {isAdmin && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    data-ocid="gallery.upload.upload_button"
                    className="bg-primary text-primary-foreground hover:bg-gold-light font-heading font-semibold"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Photo
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[oklch(0.13_0_0)] border-[oklch(0.3_0.02_91.7)] max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-gold-gradient font-display text-xl">
                      Add Photo to Gallery
                    </DialogTitle>
                  </DialogHeader>
                  <PhotoUploader
                    onUpload={handleUpload}
                    isLoading={addItem.isPending}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </motion.div>

        {/* Loading */}
        {showLoading && (
          <div
            data-ocid="gallery.loading_state"
            className="columns-1 sm:columns-2 lg:columns-3 gap-4"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <Skeleton
                  className="w-full rounded-xl bg-[oklch(0.15_0_0)]"
                  style={{ height: `${150 + (i % 3) * 60}px` }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {!showLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <GalleryGrid
              items={items}
              isAdmin={!!isAdmin}
              onDelete={handleDelete}
            />
          </motion.div>
        )}
      </div>
    </main>
  );
}
