import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Star } from "lucide-react";
import { motion } from "motion/react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[oklch(0.06_0_0)]" />
      {/* Radial gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 40%, oklch(0.862 0.196 91.7 / 0.07) 0%, transparent 70%)",
        }}
      />
      {/* Diagonal lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(60deg, oklch(0.862 0.196 91.7 / 0.15) 0px, oklch(0.862 0.196 91.7 / 0.15) 1px, transparent 1px, transparent 80px)",
        }}
      />

      {/* Floating stars */}
      {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((key, i) => (
        <motion.div
          key={key}
          className="absolute text-primary/20"
          style={{
            left: `${10 + i * 12}%`,
            top: `${15 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -12, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.3,
          }}
        >
          <Star className="h-3 w-3 fill-current" />
        </motion.div>
      ))}

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div
            className="w-28 h-28 rounded-full overflow-hidden border-2 border-[oklch(0.862_0.196_91.7/0.6)] gold-glow"
            style={{ animation: "float 3s ease-in-out infinite" }}
          >
            <img
              src="/assets/generated/gabbar-logo-transparent.dim_300x300.png"
              alt="Gabbar Classes 2.0 Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Gold accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"
        />

        {/* Tagline above */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-primary/70 font-body text-sm sm:text-base tracking-[0.3em] uppercase mb-4"
        >
          CBSE Board · Nursery to Class 8
        </motion.p>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold leading-none mb-4"
        >
          <span className="gold-shimmer">GABBAR</span>
          <br />
          <span className="text-gold-gradient">CLASSES</span>
          <span className="text-primary ml-3 font-heading text-4xl sm:text-5xl lg:text-6xl align-top mt-2 inline-block">
            2.0
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-muted-foreground font-body text-base sm:text-xl mt-4 mb-8 max-w-2xl mx-auto"
        >
          Excellence in Education · Shaping Future Leaders
          <span className="block text-sm mt-1 text-primary/60">
            Under the guidance of Director Kamal Raj Sinha
          </span>
        </motion.p>

        {/* Bottom gold line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-40 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"
        />

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/batches">
            <Button
              data-ocid="home.admission.primary_button"
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-gold-light font-heading font-bold text-base px-8 py-6 gold-glow transition-all duration-300 hover:scale-105"
            >
              Apply for Admission
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/library">
            <Button
              data-ocid="home.explore.secondary_button"
              size="lg"
              variant="outline"
              className="border-[oklch(0.862_0.196_91.7/0.5)] text-primary hover:bg-[oklch(0.862_0.196_91.7/0.1)] hover:border-primary font-heading font-semibold text-base px-8 py-6 transition-all duration-300 hover:scale-105"
            >
              Explore Classes
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
