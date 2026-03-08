import type { GalleryItem } from "@/backend.d";
import GalleryGrid from "@/components/Gallery/GalleryGrid";
import PhotoUploader from "@/components/Gallery/PhotoUploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { useIsAdmin } from "@/hooks/useQueries";
import { useQueryClient } from "@tanstack/react-query";
import { HardDrive, Loader2, Plus, RefreshCw } from "lucide-react";
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
  const [driveDialogOpen, setDriveDialogOpen] = useState(false);
  const [driveLinkInput, setDriveLinkInput] = useState("");
  const [driveTitleInput, setDriveTitleInput] = useState("");
  const [isDriveSaving, setIsDriveSaving] = useState(false);
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

  // Fetch when actor becomes ready
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

  const saveGalleryItem = async (data: {
    title: string;
    caption: string;
    imageUrl: string;
  }) => {
    if (!actor) {
      toast.error("Please login karein pehle.");
      return false;
    }
    if (!data.imageUrl) {
      toast.error("Pehle photo/link add karein.");
      return false;
    }

    const item: GalleryItem = {
      id: generateId(),
      title: data.title,
      caption: data.caption,
      imageUrl: data.imageUrl,
      uploadedAt: BigInt(Date.now()),
    };

    // Ensure admin rights before saving
    try {
      await actor.claimFirstAdmin();
    } catch {
      // Ignore -- may already be set or silently skip
    }

    try {
      await actor.addGalleryItem(item);

      // Optimistically add to local state immediately
      setItems((prev) => [item, ...prev]);

      toast.success("Photo save ho gaya!");

      qc.invalidateQueries({ queryKey: ["gallery"] });
      qc.invalidateQueries({ queryKey: ["stats"] });

      // Re-fetch to confirm persistence at 500ms and 2000ms
      setTimeout(() => fetchGallery(false), 500);
      setTimeout(() => fetchGallery(false), 2000);
      return true;
    } catch (err) {
      console.error("Gallery save failed:", err);
      toast.error(
        "Photo save nahi ho saka. Kripya pehle Admin page par jaayein aur wapas aayein.",
      );
      return false;
    }
  };

  const handleUpload = async (data: {
    title: string;
    caption: string;
    imageUrl: string;
  }) => {
    setIsSaving(true);
    const ok = await saveGalleryItem(data);
    setIsSaving(false);
    if (ok) setDialogOpen(false);
  };

  const handleDriveSave = async () => {
    if (!driveLinkInput.trim()) {
      toast.error("Google Drive link daalen.");
      return;
    }
    setIsDriveSaving(true);
    const ok = await saveGalleryItem({
      title: driveTitleInput.trim() || "Google Drive Photo",
      caption: "",
      imageUrl: driveLinkInput.trim(),
    });
    setIsDriveSaving(false);
    if (ok) {
      setDriveDialogOpen(false);
      setDriveLinkInput("");
      setDriveTitleInput("");
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
              Our Centre
            </p>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-gold-gradient section-heading">
              Photos
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
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
              <>
                {/* Upload from device */}
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
                        Add Coaching Centre Photo
                      </DialogTitle>
                    </DialogHeader>
                    <PhotoUploader
                      onUpload={handleUpload}
                      isLoading={isSaving}
                    />
                  </DialogContent>
                </Dialog>

                {/* Add via Google Drive link */}
                <Dialog
                  open={driveDialogOpen}
                  onOpenChange={setDriveDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      data-ocid="gallery.drive_link.open_modal_button"
                      variant="outline"
                      className="border-emerald-600/60 text-emerald-400 hover:bg-emerald-950/40 hover:border-emerald-500 hover:text-emerald-300 font-heading font-semibold"
                    >
                      <HardDrive className="h-4 w-4 mr-2" /> Google Drive Link
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[oklch(0.13_0_0)] border-[oklch(0.3_0.02_91.7)] max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-gold-gradient font-display text-xl">
                        Google Drive se Photo Add Karein
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div>
                        <Label className="text-foreground text-sm font-body mb-1 block">
                          Photo Title
                        </Label>
                        <Input
                          data-ocid="gallery.drive_link.input"
                          value={driveTitleInput}
                          onChange={(e) => setDriveTitleInput(e.target.value)}
                          placeholder="e.g. Classroom Photo, Event 2024"
                          className="bg-[oklch(0.1_0_0)] border-[oklch(0.3_0.02_91.7)] focus:border-primary text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                      <div>
                        <Label className="text-foreground text-sm font-body mb-1 block">
                          Google Drive Link *
                        </Label>
                        <Input
                          value={driveLinkInput}
                          onChange={(e) => setDriveLinkInput(e.target.value)}
                          placeholder="https://drive.google.com/..."
                          className="bg-[oklch(0.1_0_0)] border-[oklch(0.3_0.02_91.7)] focus:border-primary text-foreground placeholder:text-muted-foreground"
                        />
                        <p className="text-muted-foreground/70 text-xs font-body mt-1.5">
                          Google Drive mein file open karein → Share → "Anyone
                          with the link" enable karein → link copy karein.
                        </p>
                      </div>
                    </div>
                    <DialogFooter className="gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setDriveDialogOpen(false)}
                        className="border-[oklch(0.3_0.02_91.7)] text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </Button>
                      <Button
                        data-ocid="gallery.drive_link.save_button"
                        onClick={handleDriveSave}
                        disabled={isDriveSaving || !driveLinkInput.trim()}
                        className="bg-emerald-700 hover:bg-emerald-600 text-white font-heading font-semibold"
                      >
                        {isDriveSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Photo"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
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
