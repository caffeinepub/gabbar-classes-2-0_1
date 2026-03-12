import type { GalleryItem } from "@/backend.d";
import GalleryGrid from "@/components/Gallery/GalleryGrid";
import PhotoUploader from "@/components/Gallery/PhotoUploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActor } from "@/hooks/useActor";
import { useIsAdmin } from "@/hooks/useQueries";
import { useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Loader2,
  Monitor,
  PartyPopper,
  Plus,
  RefreshCw,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Category helpers ────────────────────────────────────────────────────────

const GALLERY_CATEGORIES = [
  {
    key: "offline-centre",
    label: "Offline Centre",
    fullLabel: "Offline Centre Pictures",
    icon: Building2,
    ocid: "gallery.offline.tab",
    emptyMessage: "No offline centre photos yet",
    emptySubMessage:
      "Upload photos of the coaching centre, classrooms, and infrastructure.",
  },
  {
    key: "online-material",
    label: "Online Material",
    fullLabel: "Online Material Pictures",
    icon: Monitor,
    ocid: "gallery.online.tab",
    emptyMessage: "No online material photos yet",
    emptySubMessage: "Share screenshots and photos of online study material.",
  },
  {
    key: "celebration",
    label: "Celebrations",
    fullLabel: "Celebration Pictures",
    icon: PartyPopper,
    ocid: "gallery.celebration.tab",
    emptyMessage: "No celebration photos yet",
    emptySubMessage:
      "Upload photos from annual days, prize distributions, and events.",
  },
  {
    key: "faculty",
    label: "Faculty",
    fullLabel: "Faculty Pictures",
    icon: Users,
    ocid: "gallery.faculty.tab",
    emptyMessage: "No faculty photos yet",
    emptySubMessage: "Add photos of the teachers and faculty members.",
  },
] as const;

type CategoryKey = (typeof GALLERY_CATEGORIES)[number]["key"];

function encodeCaptionWithCategory(
  category: CategoryKey,
  caption: string,
): string {
  return `[cat:${category}]${caption}`;
}

function decodeCaptionCategory(rawCaption: string): {
  category: CategoryKey;
  caption: string;
} {
  const match = rawCaption.match(/^\[cat:([^\]]+)\](.*)/s);
  if (match) {
    const cat = match[1] as CategoryKey;
    const validKeys = GALLERY_CATEGORIES.map((c) => c.key) as string[];
    if (validKeys.includes(cat)) {
      return { category: cat, caption: match[2] };
    }
  }
  // Default for old items without category prefix
  return { category: "offline-centre", caption: rawCaption };
}

// ─── Static gallery items ─────────────────────────────────────────────────────

const STATIC_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "static_gal_1",
    title: "Gabbar Classes",
    imageUrl: "/assets/uploads/IMG-20251114-WA0008-1.jpg",
    caption: "[cat:offline-centre]",
    uploadedAt: BigInt(0),
  },
  {
    id: "static_gal_2",
    title: "Gabbar Classes",
    imageUrl: "/assets/uploads/IMG-20251114-WA0009-2.jpg",
    caption: "[cat:offline-centre]",
    uploadedAt: BigInt(0),
  },
  {
    id: "static_gal_3",
    title: "Gabbar Classes",
    imageUrl: "/assets/uploads/IMG-20251114-WA0022-3.jpg",
    caption: "[cat:offline-centre]",
    uploadedAt: BigInt(0),
  },
  {
    id: "static_gal_4",
    title: "Gabbar Classes",
    imageUrl: "/assets/uploads/IMG-20251114-WA0011-4.jpg",
    caption: "[cat:offline-centre]",
    uploadedAt: BigInt(0),
  },
  {
    id: "static_gal_5",
    title: "Gabbar Classes",
    imageUrl: "/assets/uploads/IMG-20251114-WA0012-5.jpg",
    caption: "[cat:offline-centre]",
    uploadedAt: BigInt(0),
  },
  {
    id: "static_gal_6",
    title: "Gabbar Classes",
    imageUrl: "/assets/uploads/IMG-20251114-WA0026-6.jpg",
    caption: "[cat:offline-centre]",
    uploadedAt: BigInt(0),
  },
  {
    id: "static_gal_7",
    title: "Gabbar Classes",
    imageUrl: "/assets/uploads/IMG-20251114-WA0024-7.jpg",
    caption: "[cat:offline-centre]",
    uploadedAt: BigInt(0),
  },
  {
    id: "static_gal_8",
    title: "Gabbar Classes",
    imageUrl: "/assets/uploads/IMG20251114165312-8.jpg",
    caption: "[cat:offline-centre]",
    uploadedAt: BigInt(0),
  },
  {
    id: "static_gal_9",
    title: "Gabbar Classes",
    imageUrl: "/assets/uploads/IMG20251114165652-9.jpg",
    caption: "[cat:offline-centre]",
    uploadedAt: BigInt(0),
  },
  {
    id: "static_gal_10",
    title: "Gabbar Classes",
    imageUrl: "/assets/uploads/Classes-4-to-8_20260310_205213_0000-10.png",
    caption: "[cat:offline-centre]",
    uploadedAt: BigInt(0),
  },
  {
    id: "static_gal_11",
    title: "Gabbar Classes",
    imageUrl: "/assets/uploads/ChatGPT-Image-Mar-7-2026-08_51_25-PM-11.png",
    caption: "[cat:offline-centre]",
    uploadedAt: BigInt(0),
  },
];

// ─── Utilities ───────────────────────────────────────────────────────────────

function generateId() {
  return `gal_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function GalleryPage() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: isAdmin } = useIsAdmin();
  const qc = useQueryClient();

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<CategoryKey>("offline-centre");
  const hasFetchedRef = useRef(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchGallery = useCallback(
    async (showRefreshSpinner = false) => {
      if (!actor) return;
      if (showRefreshSpinner) setIsRefreshing(true);
      else if (!hasFetchedRef.current) setIsLoading(true);

      try {
        const result = await actor.getAllGalleryItems();
        const backendList = Array.isArray(result) ? result : [];
        backendList.sort((a, b) => Number(b.uploadedAt) - Number(a.uploadedAt));

        // Merge static items, deduplicating by id
        const backendIds = new Set(backendList.map((i) => i.id));
        const uniqueStatic = STATIC_GALLERY_ITEMS.filter(
          (s) => !backendIds.has(s.id),
        );
        setItems([...backendList, ...uniqueStatic]);
        hasFetchedRef.current = true;
      } catch (err) {
        console.error("Gallery fetch failed:", err);
        // Still show static items even if backend fails
        setItems(STATIC_GALLERY_ITEMS);
        toast.error("Gallery load nahi ho saki. Dobara try karein.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [actor],
  );

  useEffect(() => {
    if (actor && !actorFetching) {
      fetchGallery(false);
    }
  }, [actor, actorFetching, fetchGallery]);

  useEffect(() => {
    if (actorFetching && !hasFetchedRef.current) {
      setIsLoading(true);
    }
  }, [actorFetching]);

  // ── Save ───────────────────────────────────────────────────────────────────
  const saveGalleryItem = async (data: {
    title: string;
    caption: string;
    imageUrl: string;
    category: CategoryKey;
  }) => {
    if (!actor) {
      toast.error("Please login karein pehle.");
      return false;
    }
    if (!data.imageUrl) {
      toast.error("Pehle photo ya Google Drive link add karein.");
      return false;
    }

    const item: GalleryItem = {
      id: generateId(),
      title: data.title || "Photo",
      imageUrl: data.imageUrl,
      caption: encodeCaptionWithCategory(data.category, data.caption),
      uploadedAt: BigInt(Date.now()),
    };

    try {
      await actor.addGalleryItem(item);
      // Optimistic update so it appears instantly
      setItems((prev) => [item, ...prev]);
      toast.success("Photo save ho gaya!");
      qc.invalidateQueries({ queryKey: ["gallery"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
      // Confirm persistence with two re-fetches after backend settles
      setTimeout(() => fetchGallery(false), 800);
      setTimeout(() => fetchGallery(false), 3000);
      return true;
    } catch (err) {
      console.error("Gallery save failed:", err);
      toast.error("Photo save nahi ho saka. Dobara try karein.");
      return false;
    }
  };

  const handleUpload = async (data: {
    title: string;
    caption: string;
    imageUrl: string;
  }) => {
    setIsSaving(true);
    const ok = await saveGalleryItem({ ...data, category: activeCategory });
    setIsSaving(false);
    if (ok) setDialogOpen(false);
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!actor) return;
    // Prevent deleting static items
    if (id.startsWith("static_gal_")) {
      toast.error("Yeh photo delete nahi ki ja sakti.");
      return;
    }
    try {
      await actor.deleteGalleryItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Photo delete ho gayi.");
      qc.invalidateQueries({ queryKey: ["gallery"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    } catch {
      toast.error("Photo delete nahi ho saki.");
    }
  };

  // ── Per-category items ─────────────────────────────────────────────────────
  const itemsByCategory = GALLERY_CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat.key] = items.filter(
        (item) => decodeCaptionCategory(item.caption).category === cat.key,
      );
      return acc;
    },
    {} as Record<CategoryKey, GalleryItem[]>,
  );

  // Strip category prefix from caption before rendering
  const strippedItems = (catKey: CategoryKey) =>
    itemsByCategory[catKey].map((item) => ({
      ...item,
      caption: decodeCaptionCategory(item.caption).caption,
    }));

  const activeCatInfo =
    GALLERY_CATEGORIES.find((c) => c.key === activeCategory) ??
    GALLERY_CATEGORIES[0];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <p className="text-primary/70 font-body text-sm tracking-widest uppercase mb-2">
              Our Centre
            </p>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-gold-gradient section-heading">
              Gallery
            </h1>
            <p className="text-muted-foreground font-body text-sm mt-2">
              Our Memories — Offline Centre, Online Material, Celebrations &amp;
              Faculty
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Refresh */}
            <Button
              data-ocid="gallery.refresh.button"
              variant="outline"
              size="sm"
              onClick={() => {
                fetchGallery(true);
                toast.success("Gallery refresh ho rahi hai...");
              }}
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

            {/* Add Photo (admin only) */}
            {isAdmin && (
              <Button
                data-ocid="gallery.add.open_modal_button"
                className="bg-primary text-primary-foreground hover:bg-gold-light font-heading font-semibold"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Photo
              </Button>
            )}
          </div>
        </motion.div>

        {/* ── Add Photo Dialog ── */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-[oklch(0.13_0_0)] border-[oklch(0.3_0.02_91.7)] max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-gold-gradient font-display text-xl">
                Add Photo — {activeCatInfo.fullLabel}
              </DialogTitle>
            </DialogHeader>
            <PhotoUploader
              onUpload={handleUpload}
              isLoading={isSaving}
              categoryLabel={activeCatInfo.label}
            />
          </DialogContent>
        </Dialog>

        {/* ── Loading skeleton ── */}
        {isLoading && (
          <div data-ocid="gallery.loading_state">
            {/* Skeleton tabs */}
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  className="h-10 w-28 rounded-lg bg-[oklch(0.15_0_0)]"
                />
              ))}
            </div>
            {/* Skeleton grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton
                  key={i}
                  className="w-full aspect-video rounded-xl bg-[oklch(0.15_0_0)]"
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Category Tabs ── */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Tabs
              value={activeCategory}
              onValueChange={(v) => {
                setActiveCategory(v as CategoryKey);
              }}
            >
              {/* Tab triggers */}
              <TabsList className="bg-[oklch(0.1_0_0)] border border-[oklch(0.25_0.02_91.7)] p-1 gap-1 w-full flex overflow-x-auto mb-6">
                {GALLERY_CATEGORIES.map((cat) => (
                  <TabsTrigger
                    key={cat.key}
                    value={cat.key}
                    data-ocid={cat.ocid}
                    className="flex items-center gap-1.5 text-xs sm:text-sm font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold flex-1 min-w-0 py-2"
                  >
                    <cat.icon className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="hidden sm:inline truncate">
                      {cat.label}
                    </span>
                    {/* Count badge */}
                    {itemsByCategory[cat.key].length > 0 && (
                      <span className="hidden sm:inline-flex items-center justify-center h-4 min-w-4 px-1 text-[10px] font-bold rounded-full bg-primary/20 text-primary data-[state=active]:bg-primary-foreground/20 data-[state=active]:text-primary-foreground ml-0.5">
                        {itemsByCategory[cat.key].length}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Tab content areas */}
              {GALLERY_CATEGORIES.map((cat) => (
                <TabsContent key={cat.key} value={cat.key} className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    {/* Sub-heading for category */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[oklch(0.862_0.196_91.7/0.1)] border border-[oklch(0.862_0.196_91.7/0.25)] flex items-center justify-center">
                          <cat.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-lg font-display font-bold text-gold-gradient">
                            {cat.fullLabel}
                          </h2>
                          <p className="text-muted-foreground font-body text-xs">
                            {itemsByCategory[cat.key].length} photo
                            {itemsByCategory[cat.key].length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      {/* Admin: add to this category */}
                      {isAdmin && (
                        <Button
                          data-ocid={`gallery.${cat.key}.button`}
                          size="sm"
                          className="bg-primary text-primary-foreground hover:bg-gold-light font-heading font-semibold text-xs"
                          onClick={() => {
                            setActiveCategory(cat.key);
                            setDialogOpen(true);
                          }}
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Add Photo
                        </Button>
                      )}
                    </div>

                    {/* Photo grid */}
                    <GalleryGrid
                      items={strippedItems(cat.key)}
                      isAdmin={!!isAdmin}
                      onDelete={handleDelete}
                      emptyMessage={cat.emptyMessage}
                      emptySubMessage={
                        isAdmin
                          ? `Click "Add Photo" to upload photos for ${cat.label}.`
                          : cat.emptySubMessage
                      }
                    />
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        )}

        {/* Footer count */}
        {!isLoading && items.length > 0 && (
          <p className="text-center text-muted-foreground/40 text-xs font-body mt-10">
            {items.length} total photo{items.length !== 1 ? "s" : ""} across all
            categories
          </p>
        )}
      </div>
    </main>
  );
}
