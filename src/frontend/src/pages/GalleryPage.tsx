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
import { useIsAdmin } from "@/hooks/useQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function generateId() {
  return `gal_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export default function GalleryPage() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: isAdmin } = useIsAdmin();
  const qc = useQueryClient();

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const hasFetchedRef = useRef(false);

  // Fetch gallery directly from actor -- no React Query cache issues
  const fetchGallery = useCallback(
    async (showRefreshSpinner = false) => {
      if (!actor) return;
      if (showRefreshSpinner) setIsRefreshing(true);
      else if (!hasFetchedRef.current) setIsLoading(true);

      try {
        const result = await actor.getAllGalleryItems();
        const list = Array.isArray(result) ? result : [];
        // Sort by newest first
        list.sort((a, b) => Number(b.uploadedAt) - Number(a.uploadedAt));
        setItems(list);
        hasFetchedRef.current = true;
      } catch (err) {
        console.error("Gallery fetch failed:", err);
        toast.error("Gallery load nahi ho saki. Dobara try karein.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [actor],
  );

  // Fetch when actor becomes ready -- getAllGalleryItems is a public query
  // so any ready actor (authenticated or anonymous) can call it
  useEffect(() => {
    if (actor && !actorFetching) {
      fetchGallery(false);
    }
  }, [actor, actorFetching, fetchGallery]);

  // Ensure loading state is shown while actor is still initializing
  useEffect(() => {
    if (actorFetching && !hasFetchedRef.current) {
      setIsLoading(true);
    }
  }, [actorFetching]);

  const handleUpload = async (data: {
    title: string;
    caption: string;
    imageUrl: string;
  }) => {
    if (!actor) {
      toast.error("Please login karein pehle.");
      return;
    }
    if (!data.imageUrl) {
      toast.error("Pehle photo upload karein.");
      return;
    }

    setIsSaving(true);
    try {
      // Step 1: Try to claim admin (no-op if already admin or slot taken by another)
      try {
        await actor.claimFirstAdmin();
      } catch {
        // Ignore -- may already be claimed
      }

      // Step 2: Verify admin access before proceeding
      const isAdmin = await actor.isCallerAdmin();
      if (!isAdmin) {
        throw new Error("Unauthorized: Only admins can add gallery items");
      }

      // Step 3: Save the gallery item
      const item: GalleryItem = {
        id: generateId(),
        title: data.title,
        caption: data.caption,
        imageUrl: data.imageUrl,
        uploadedAt: BigInt(Date.now()),
      };
      await actor.addGalleryItem(item);

      // Step 4: Optimistically add to local state immediately
      setItems((prev) => [item, ...prev]);

      toast.success("Photo gallery mein save ho gaya!");
      setDialogOpen(false);

      // Step 5: Invalidate React Query caches
      qc.invalidateQueries({ queryKey: ["gallery"] });
      qc.invalidateQueries({ queryKey: ["stats"] });

      // Step 6: Double re-fetch to ensure backend persistence is confirmed
      setTimeout(() => fetchGallery(false), 1000);
      setTimeout(() => fetchGallery(false), 3000);
    } catch (err) {
      const errMsg = String(err);
      console.error("Gallery save failed:", err);
      if (errMsg.includes("Unauthorized") || errMsg.includes("Only admin")) {
        toast.error(
          "Admin access nahi mila. Admin page par jaayein aur dobara login karein.",
        );
      } else {
        toast.error("Photo save nahi ho saka. Dobara try karein.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!actor) return;
    try {
      await actor.deleteGalleryItem(id);
      // Remove from local state immediately
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Photo delete ho gayi.");
      qc.invalidateQueries({ queryKey: ["gallery"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    } catch {
      toast.error("Photo delete nahi ho saki.");
    }
  };

  const handleRefresh = () => {
    fetchGallery(true);
    toast.success("Gallery refresh ho rahi hai...");
  };

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
            {/* Refresh button */}
            <Button
              data-ocid="gallery.refresh.button"
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="border-[oklch(0.3_0.02_91.7)] text-muted-foreground hover:text-foreground hover:border-primary/50 font-heading"
            >
              {isRefreshing ? (
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
                  <PhotoUploader onUpload={handleUpload} isLoading={isSaving} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </motion.div>

        {/* Loading skeleton */}
        {isLoading && (
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
        {!isLoading && (
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

        {/* Photo count info */}
        {!isLoading && items.length > 0 && (
          <p className="text-center text-muted-foreground/50 text-xs font-body mt-8">
            {items.length} photo{items.length !== 1 ? "s" : ""} in gallery
          </p>
        )}
      </div>
    </main>
  );
}
