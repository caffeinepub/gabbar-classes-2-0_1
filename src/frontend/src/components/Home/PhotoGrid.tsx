import { X, ZoomIn } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const PHOTOS = [
  {
    src: "/assets/uploads/ChatGPT-Image-Mar-7-2026-08_51_25-PM-11.png",
    alt: "Gabbar Classes 2.0 Banner",
    span: "col-span-2 row-span-2",
    featured: true,
  },
  {
    src: "/assets/uploads/IMG-20251114-WA0008-1.jpg",
    alt: "Gabbar Classes Moment 1",
    span: "",
    featured: false,
  },
  {
    src: "/assets/uploads/IMG-20251114-WA0009-2.jpg",
    alt: "Gabbar Classes Moment 2",
    span: "",
    featured: false,
  },
  {
    src: "/assets/uploads/IMG-20251114-WA0022-3.jpg",
    alt: "Gabbar Classes Moment 3",
    span: "",
    featured: false,
  },
  {
    src: "/assets/uploads/IMG-20251114-WA0011-4.jpg",
    alt: "Gabbar Classes Moment 4",
    span: "",
    featured: false,
  },
  {
    src: "/assets/uploads/IMG-20251114-WA0012-5.jpg",
    alt: "Gabbar Classes Moment 5",
    span: "",
    featured: false,
  },
  {
    src: "/assets/uploads/IMG-20251114-WA0026-6.jpg",
    alt: "Gabbar Classes Moment 6",
    span: "",
    featured: false,
  },
  {
    src: "/assets/uploads/IMG-20251114-WA0024-7.jpg",
    alt: "Gabbar Classes Moment 7",
    span: "",
    featured: false,
  },
  {
    src: "/assets/uploads/IMG20251114165312-8.jpg",
    alt: "Gabbar Classes Moment 8",
    span: "",
    featured: false,
  },
  {
    src: "/assets/uploads/IMG20251114165652-9.jpg",
    alt: "Gabbar Classes Moment 9",
    span: "",
    featured: false,
  },
  {
    src: "/assets/uploads/Classes-4-to-8_20260310_205213_0000-10.png",
    alt: "Gabbar Classes 4 to 8",
    span: "col-span-2",
    featured: false,
  },
];

export default function PhotoGrid() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);

  const prev = () =>
    setLightbox((i) =>
      i !== null ? (i - 1 + PHOTOS.length) % PHOTOS.length : null,
    );
  const next = () =>
    setLightbox((i) => (i !== null ? (i + 1) % PHOTOS.length : null));

  return (
    <section className="py-16 max-w-7xl mx-auto px-4">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h2 className="text-3xl font-display font-bold text-gold-gradient section-heading mb-2">
          Our Moments
        </h2>
        <p className="text-muted-foreground font-body text-sm">
          Glimpses from Gabbar Classes — celebrations, learning & more
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[180px] sm:auto-rows-[200px] lg:auto-rows-[220px]"
      >
        {PHOTOS.map((photo, i) => (
          <motion.div
            key={photo.src}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className={`relative group overflow-hidden rounded-xl border border-[oklch(0.862_0.196_91.7/0.15)] hover:border-[oklch(0.862_0.196_91.7/0.6)] transition-all duration-300 cursor-pointer ${
              photo.featured
                ? "col-span-2 row-span-2"
                : photo.span
                  ? photo.span
                  : ""
            }`}
            onClick={() => openLightbox(i)}
            data-ocid={`gallery.item.${i + 1}`}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-10 h-10 rounded-full bg-[oklch(0.862_0.196_91.7/0.25)] border border-[oklch(0.862_0.196_91.7/0.7)] flex items-center justify-center backdrop-blur-sm">
                <ZoomIn className="h-5 w-5 text-primary" />
              </div>
            </div>
            {photo.featured && (
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-[oklch(0.862_0.196_91.7/0.2)] border border-[oklch(0.862_0.196_91.7/0.5)] backdrop-blur-sm">
                <span className="text-xs font-heading text-primary tracking-widest uppercase">
                  Featured
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
            data-ocid="gallery.modal"
          >
            {/* Close */}
            <button
              type="button"
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[oklch(0.862_0.196_91.7/0.15)] border border-[oklch(0.862_0.196_91.7/0.4)] flex items-center justify-center text-primary hover:bg-[oklch(0.862_0.196_91.7/0.3)] transition-all z-10"
              onClick={closeLightbox}
              data-ocid="gallery.close_button"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Prev */}
            <button
              type="button"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[oklch(0.862_0.196_91.7/0.15)] border border-[oklch(0.862_0.196_91.7/0.4)] flex items-center justify-center text-primary hover:bg-[oklch(0.862_0.196_91.7/0.3)] transition-all z-10"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              data-ocid="gallery.pagination_prev"
            >
              ‹
            </button>

            {/* Image */}
            <motion.img
              key={lightbox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              src={PHOTOS[lightbox].src}
              alt={PHOTOS[lightbox].alt}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl border border-[oklch(0.862_0.196_91.7/0.3)] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next */}
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[oklch(0.862_0.196_91.7/0.15)] border border-[oklch(0.862_0.196_91.7/0.4)] flex items-center justify-center text-primary hover:bg-[oklch(0.862_0.196_91.7/0.3)] transition-all z-10"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              data-ocid="gallery.pagination_next"
            >
              ›
            </button>

            {/* Caption */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
              <span className="text-xs text-muted-foreground font-body">
                {lightbox + 1} / {PHOTOS.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
